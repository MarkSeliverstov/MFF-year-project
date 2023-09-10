/**
 * Helps to find the line number of the regex matched characters for multiline inputs
 */
export function lineNumberByMatchIndex(index: number,text: string): number{
    let line = 0,
        match;
    const re = /^[\S\s]/gm;
    while ((match = re.exec(text))) {
        if(match.index > index) {break;}
        line++;
    }
    return line;
}