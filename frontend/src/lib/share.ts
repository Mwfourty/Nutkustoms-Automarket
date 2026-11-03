export type ShareResult = 'shared' | 'copied' | 'failed';

/**
 * Opens the native share sheet on touch devices, otherwise copies the link.
 * Never throws: dismissing the sheet or a blocked clipboard returns 'failed'.
 */
export const shareLink = async (title: string, url = window.location.href): Promise<ShareResult> => {
  const useSheet =
    typeof navigator.share === 'function' && window.matchMedia('(pointer: coarse)').matches;
  try {
    if (useSheet) {
      await navigator.share({ title, url });
      return 'shared';
    }
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch {
    return 'failed';
  }
};