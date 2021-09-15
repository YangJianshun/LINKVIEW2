import lineReader from 'line-reader';

// eachLine 用于异步按行读取文件，eachLineCallBack 回调接受的参数 lineIndex 可能不会严格映射内容和行号。
const eachLine = (
  fileName: string,
  eachLineCallBack: (line: string, lineIndex: number) => boolean | undefined,
  filter?: (line: string) => boolean
) => {
  let lineIndex = 0;
  return new Promise((resolve, reject) => {
    lineReader.eachLine(
      fileName,
      function (line) {
        if (filter && filter(line)) return true;
        lineIndex += 1;
        return eachLineCallBack(line, lineIndex);
      },
      function (err) {
        if (err) reject(err);
        resolve(fileName);
      }
    );
  });
};

export default eachLine;
