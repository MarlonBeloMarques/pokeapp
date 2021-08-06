import RNFetchBlob from 'rn-fetch-blob';

const RNFetchBlobMock = jest.mock('rn-fetch-blob') as unknown as jest.Mocked<typeof RNFetchBlob>;

RNFetchBlobMock.fetch = jest.fn();
RNFetchBlobMock.wrap = jest.fn();

export default { RNFetchBlobMock };
