import { Transform } from 'node:stream';
export class PrependInitVectTransform extends Transform {
    initVect;
    notPrepended;
    constructor(initVect, opts) {
        super(opts);
        this.initVect = initVect;
        this.notPrepended = true;
    }
    _transform(chunk, encoding, callback) {
        if (this.notPrepended) {
            this.push(this.initVect);
            this.notPrepended = false;
        }
        this.push(chunk);
        callback();
    }
}
export class ProgressTransform extends Transform {
    processedChunksN = 0;
    totalChunksN = 0;
    updateProcess(percent) {
        console.log('current progress:', percent, '%');
    }
    constructor({ total, updateProcess }, options) {
        super(options);
        this.totalChunksN = total;
        this.processedChunksN = 0;
        if (updateProcess) {
            this.updateProcess = updateProcess;
        }
    }
    _transform(chunk, encoding, callback) {
        this.processedChunksN++;
        const cp = (this.processedChunksN * 100) / this.totalChunksN;
        this.updateProcess(cp);
        this.push(chunk);
        callback();
    }
}
