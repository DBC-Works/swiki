/**
 * Get upload text
 * @param files FileList instance
 * @returns File text content as a Promise
 */
export const getUploadText = (files: FileList): Promise<string> => files[0].text()
