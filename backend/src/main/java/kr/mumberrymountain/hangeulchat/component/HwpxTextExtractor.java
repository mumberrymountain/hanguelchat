package kr.mumberrymountain.hangeulchat.component;

import kr.dogfoot.hwpxlib.object.HWPXFile;
import kr.dogfoot.hwpxlib.reader.HWPXReader;
import kr.dogfoot.hwpxlib.tool.textextractor.TextExtractor;
import kr.dogfoot.hwpxlib.tool.textextractor.TextMarks;

import java.io.File;

import static kr.dogfoot.hwpxlib.tool.textextractor.TextExtractMethod.InsertControlTextBetweenParagraphText;

public class HwpxTextExtractor implements HangeulTextExtractor {

    @Override
    public String extract(File file) throws Exception {
        HWPXFile hwpxFile = HWPXReader.fromFile(file);
        return TextExtractor.extract(
                hwpxFile,
                InsertControlTextBetweenParagraphText,
                false,
                getTextMarks()
        );
    }

    private TextMarks getTextMarks() {
        TextMarks textMarks = new TextMarks();
        textMarks.lineBreak("\n");
        textMarks.paraSeparator("\n");
        textMarks.tableStart("<표>\n");
        textMarks.tableEnd("\n</표>");
        textMarks.tableRowSeparatorAnd("\n ----------------- \n");
        textMarks.tableCellSeparatorAnd(" | ");
        return textMarks;
    }
}
