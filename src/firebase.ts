import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { GroupSubmission } from './types/lkpd';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'groups', 'connection-test'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline or connecting...");
      return false;
    }
    // Expected to succeed or throw not found, which means connection is live
    return true;
  }
}

// Subscribe to all groups in real-time
export function subscribeToGroups(
  onData: (groups: GroupSubmission[]) => void,
  onError?: (err: any) => void
) {
  const path = 'groups';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: GroupSubmission[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        if (data && data.identity) {
          list.push({
            id: d.id,
            identity: data.identity,
            studentCodes: data.studentCodes || {},
            moduleCodes: data.moduleCodes || {},
            passedExercises: data.passedExercises || {},
            passedModules: data.passedModules || {},
            reflectionAnswers: data.reflectionAnswers || {},
            rubricScores: data.rubricScores || {},
            teacherFeedback: data.teacherFeedback || '',
            teacherName: data.teacherName || '',
            updatedAt: data.updatedAt || new Date().toISOString(),
          });
        }
      });
      // Sort by updatedAt descending
      list.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
      onData(list);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

// Save or sync a single group submission to Firestore
export async function saveGroupToFirestore(group: GroupSubmission): Promise<void> {
  const path = `groups/${group.id}`;
  try {
    // Sanitize data before writing
    const payload = {
      id: group.id,
      identity: group.identity,
      studentCodes: group.studentCodes || {},
      moduleCodes: group.moduleCodes || {},
      passedExercises: group.passedExercises || {},
      passedModules: group.passedModules || {},
      reflectionAnswers: group.reflectionAnswers || {},
      rubricScores: group.rubricScores || {},
      teacherFeedback: group.teacherFeedback || '',
      teacherName: group.teacherName || '',
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'groups', group.id), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete a group submission from Firestore
export async function deleteGroupFromFirestore(groupId: string): Promise<void> {
  const path = `groups/${groupId}`;
  try {
    await deleteDoc(doc(db, 'groups', groupId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Subscribe to Teacher Config (such as PIN)
export function subscribeToTeacherConfig(
  onData: (pin: string) => void,
  onError?: (err: any) => void
) {
  const path = 'settings/teacher';
  return onSnapshot(
    doc(db, 'settings', 'teacher'),
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data && data.pin) {
          onData(data.pin);
        }
      }
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// Save Teacher PIN to Firestore
export async function saveTeacherPinToFirestore(newPin: string): Promise<void> {
  const path = 'settings/teacher';
  try {
    await setDoc(
      doc(db, 'settings', 'teacher'),
      {
        pin: newPin,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
