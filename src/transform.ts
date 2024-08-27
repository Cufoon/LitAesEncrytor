import { Transform } from 'node:stream';

import type { TransformCallback, TransformOptions } from 'node:stream';

export class PrependInitVectTransform extends Transform {
  initVect: Buffer;
  notPrepended: boolean;

  constructor(initVect: Buffer, opts?: TransformOptions) {
    super(opts);
    this.initVect = initVect;
    this.notPrepended = true;
  }

  _transform(
    chunk: unknown,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) {
    if (this.notPrepended) {
      this.push(this.initVect);
      this.notPrepended = false;
    }
    this.push(chunk);
    callback();
  }
}

interface ProgressTransformConstructorOption {
  total: number;
  updateProcess?: (percent: number) => unknown;
}

export class ProgressTransform extends Transform {
  processedChunksN = 0;
  totalChunksN = 0;

  updateProcess(percent: number) {
    console.log('current progress:', percent, '%');
  }

  constructor(
    { total, updateProcess }: ProgressTransformConstructorOption,
    options?: TransformOptions
  ) {
    super(options);
    this.totalChunksN = total;
    this.processedChunksN = 0;
    if (updateProcess) {
      this.updateProcess = updateProcess;
    }
  }

  _transform(
    chunk: unknown,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) {
    this.processedChunksN++;
    const cp = (this.processedChunksN * 100) / this.totalChunksN;
    this.updateProcess(cp);
    this.push(chunk);
    callback();
  }
}
