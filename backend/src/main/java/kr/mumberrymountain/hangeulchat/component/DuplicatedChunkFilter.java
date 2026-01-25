package kr.mumberrymountain.hangeulchat.component;

import kr.mumberrymountain.hangeulchat.component.factory.EmbeddingModelFactory;
import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class DuplicatedChunkFilter {

   private final double similarityThreshold = 0.7;
   private final EmbeddingModelFactory embeddingModelFactory;

   public DuplicatedChunkFilter(EmbeddingModelFactory embeddingModelFactory) {
       this.embeddingModelFactory = embeddingModelFactory;
   }

   public String filter(String text, String filename, String apiKey) {
       List<Document> documents = splitExtractedTextIntoChunk(text, filename);
       
       EmbeddingModel embeddingModel = embeddingModelFactory.create(apiKey);
           return filterDuplicates(documents, embeddingModel).stream()
                   .map(Document::getText)
                   .collect(Collectors.joining("\n\n"));
   }

   private List<Document> splitExtractedTextIntoChunk(String text, String filename){
       String[] lines = text.split("\n");
       List<Document> documents = new ArrayList<>();

       for (int i = 0; i < lines.length; i++) {
           String line = lines[i].trim();
           if (line.isEmpty()) continue;

           Map<String, Object> metadata = new HashMap<>();
           metadata.put("source", filename);
           metadata.put("line_number", i + 1);
           metadata.put("chunk_type", "line");

           Document document = new Document(line, metadata);
           documents.add(document);
       }

       return documents;
   }

   private List<Document> filterDuplicates(List<Document> documents, EmbeddingModel embeddingModel) {
       if (documents.isEmpty()) return documents;

       List<String> texts = documents.stream()
               .map(Document::getText)
               .collect(Collectors.toList());
       
       EmbeddingResponse response = embeddingModel.embedForResponse(texts);
       List<float[]> embeddings = response.getResults().stream()
               .map(embedding -> embedding.getOutput())
               .collect(Collectors.toList());

       List<Document> uniqueDocuments = new ArrayList<>();
       List<float[]> uniqueEmbeddings = new ArrayList<>();

       for (int i = 0; i < documents.size(); i++) {
           float[] currentEmbedding = embeddings.get(i);
           boolean isDuplicate = false;

           for (float[] uniqueEmbedding : uniqueEmbeddings) {
               if (cosineSimilarity(currentEmbedding, uniqueEmbedding) > similarityThreshold) {
                   isDuplicate = true;
                   break;
               }
           }

           if (isDuplicate) continue;
           
           uniqueDocuments.add(documents.get(i));
           uniqueEmbeddings.add(currentEmbedding);
       }

       return uniqueDocuments;
   }

   private double cosineSimilarity(float[] a, float[] b) {
       double dotProduct = 0.0;
       double normA = 0.0;
       double normB = 0.0;

       for (int i = 0; i < a.length; i++) {
           dotProduct += a[i] * b[i];
           normA += a[i] * a[i];
           normB += b[i] * b[i];
       }

       if (normA == 0 || normB == 0) return 0.0;
       return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
   }
}
