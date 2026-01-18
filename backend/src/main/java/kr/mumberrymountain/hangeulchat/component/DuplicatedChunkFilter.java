package kr.mumberrymountain.hangeulchat.component;

//import lombok.RequiredArgsConstructor;
//import org.springframework.ai.document.Document;
//import org.springframework.ai.vectorstore.SearchRequest;
//import org.springframework.ai.vectorstore.VectorStore;
//import org.springframework.stereotype.Component;
//
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Component
//@RequiredArgsConstructor
//public class DuplicatedChunkFilter {
//
//    private final VectorStore vectorStore;
//    private final double similarityThreshold = 0.7;
//
//    public String filter(String text, String filename) {
//        List<Document> documents = splitExtractedTextIntoChunk(text, filename);
//        vectorStore.add(documents);
//
//        return filterDuplicates(documents).stream()
//                .map(Document::getText)
//                .collect(Collectors.joining("\n\n"));
//    }
//
//    private List<Document> splitExtractedTextIntoChunk(String text, String filename){
//        String[] lines = text.split("\n");
//        List<Document> documents = new ArrayList<>();
//
//        for (int i = 0; i < lines.length; i++) {
//            String line = lines[i].trim();
//            if (line.isEmpty()) continue;
//
//            Map<String, Object> metadata = new HashMap<>();
//            metadata.put("source", filename);
//            metadata.put("line_number", i + 1);
//            metadata.put("chunk_type", "line");
//
//            Document document = new Document(line, metadata);
//            documents.add(document);
//        }
//
//        return documents;
//    }
//
//    private List<Document> filterDuplicates(List<Document> documents) {
//        List<Document> uniqueDocuments = Collections.synchronizedList(new ArrayList<>());
//        for (Document document : documents) {
//            if (checkDocumentDuplication(document, uniqueDocuments)) continue;
//            uniqueDocuments.add(document);
//        }
//
//        return uniqueDocuments;
//    }
//
//    private boolean checkDocumentDuplication(Document document, List<Document> uniqueDocuments) {
//        for (Document uniqueDoc : uniqueDocuments) {
//            if (calculateVectorSimilarity(document.getText(), uniqueDoc.getText()) > similarityThreshold) {
//                return true;
//            }
//        }
//        return false;
//    }
//
//    private double calculateVectorSimilarity(String text1, String text2) {
//        List<Document> results = searchSimilar(text1);
//
//        for (Document result : results) {
//            if (result.getText().equals(text2)) {
//                int index = results.indexOf(result);
//                return 1.0 - (index * 0.1);
//            }
//        }
//
//        return 0.0;
//    }
//
//    private List<Document> searchSimilar(String query) {
//        return vectorStore.similaritySearch(
//                SearchRequest.builder()
//                        .query(query)
//                        .topK(5)
//                        .build()
//        );
//    }
//}
