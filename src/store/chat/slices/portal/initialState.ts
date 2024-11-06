import { PortalArtifact } from '@/types/artifact';
import { ThreadType } from '@/types/topic';

export interface PortalFile {
  chunkId?: string;
  chunkText?: string;
  fileId: string;
}

export interface ChatPortalState {
  portalArtifact?: PortalArtifact;
  portalArtifactDisplayMode?: 'code' | 'preview';
  portalFile?: PortalFile;
  portalMessageDetail?: string;
  portalNewThreadMode?: ThreadType;
  portalThreadStartMessageId?: string;
  portalToolMessage?: { id: string; identifier: string };
  showPortal: boolean;
}

export const initialChatPortalState: ChatPortalState = {
  portalArtifactDisplayMode: 'preview',
  portalNewThreadMode: ThreadType.Continuation,
  showPortal: false,
};
