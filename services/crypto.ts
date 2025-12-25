export const sealThought = async (content: string, reasoning: string, modality: any) => {
  const msgUint8 = new TextEncoder().encode(content + reasoning + Date.now());
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
  const hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  return {
    id: `seal-${Math.random().toString(36).substr(2, 9)}`,
    hash,
    timestamp: Date.now(),
    modality,
    content,
    reasoning
  };
};
