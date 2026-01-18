package kr.mumberrymountain.hangeulchat.component;

import kr.dogfoot.hwplib.object.HWPFile;
import kr.dogfoot.hwplib.reader.HWPReader;
import kr.dogfoot.hwplib.tool.textextractor.TextExtractMethod;
import kr.dogfoot.hwplib.tool.textextractor.TextExtractor;

import java.io.File;

public class HwpTextExtractor implements HangeulTextExtractor {
    @Override
    public String extract(File file) throws Exception {
        HWPFile hwpFile = HWPReader.fromFile(file);

        return TextExtractor.extract(hwpFile, TextExtractMethod.InsertControlTextBetweenParagraphText);
    }
}
