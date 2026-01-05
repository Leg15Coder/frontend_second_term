import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import type { Request, Response } from 'firebase-functions';

admin.initializeApp();

interface UserDetail {
  uid: string;
  email: string | undefined;
  createdAt: string;
  daysOld: number;
}

export const cleanupUnverifiedAccounts = functions.pubsub
  .schedule('0 2 * * *')
  .timeZone('UTC')
  .onRun(async () => {
    console.log('Starting cleanup of unverified accounts...');

    const DAYS_TO_DELETE = 7;
    const now = Date.now();
    const cutoffTime = now - (DAYS_TO_DELETE * 24 * 60 * 60 * 1000);

    try {
      const listUsersResult = await admin.auth().listUsers(1000);
      const usersToDelete: string[] = [];

      for (const user of listUsersResult.users) {
        if (!user.emailVerified) {
          const createdAt = new Date(user.metadata.creationTime).getTime();

          if (createdAt < cutoffTime) {
            usersToDelete.push(user.uid);
            console.log(`Marking user for deletion: ${user.email} (created: ${user.metadata.creationTime})`);
          }
        }
      }

      if (usersToDelete.length > 0) {
        console.log(`Deleting ${usersToDelete.length} unverified accounts...`);

        const deletePromises = usersToDelete.map(uid =>
          admin.auth().deleteUser(uid)
            .then(() => {
              console.log(`Successfully deleted user: ${uid}`);
              return { uid, success: true };
            })
            .catch((error: Error) => {
              console.error(`Failed to delete user ${uid}:`, error);
              return { uid, success: false, error };
            })
        );

        const results = await Promise.allSettled(deletePromises);
        const successCount = results.filter(r => r.status === 'fulfilled').length;

        console.log(`Cleanup completed: ${successCount}/${usersToDelete.length} accounts deleted`);

        return {
          totalChecked: listUsersResult.users.length,
          markedForDeletion: usersToDelete.length,
          successfullyDeleted: successCount,
          timestamp: new Date().toISOString()
        };
      } else {
        console.log('No unverified accounts found older than 7 days');
        return {
          totalChecked: listUsersResult.users.length,
          markedForDeletion: 0,
          successfullyDeleted: 0,
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
      throw new functions.https.HttpsError('internal', 'Failed to cleanup unverified accounts');
    }
  });

export const manualCleanupUnverifiedAccounts = functions.https.onRequest(async (req: Request, res: Response) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  console.log('Manual cleanup triggered');

  const DAYS_TO_DELETE = 7;
  const now = Date.now();
  const cutoffTime = now - (DAYS_TO_DELETE * 24 * 60 * 60 * 1000);

  try {
    const listUsersResult = await admin.auth().listUsers(1000);
    const usersToDelete: string[] = [];
    const userDetails: UserDetail[] = [];

    for (const user of listUsersResult.users) {
      if (!user.emailVerified) {
        const createdAt = new Date(user.metadata.creationTime).getTime();

        if (createdAt < cutoffTime) {
          usersToDelete.push(user.uid);
          userDetails.push({
            uid: user.uid,
            email: user.email,
            createdAt: user.metadata.creationTime,
            daysOld: Math.floor((now - createdAt) / (24 * 60 * 60 * 1000))
          });
        }
      }
    }

    if (usersToDelete.length > 0) {
      const deletePromises = usersToDelete.map(uid =>
        admin.auth().deleteUser(uid)
      );

      await Promise.all(deletePromises);

      res.status(200).json({
        success: true,
        message: `Deleted ${usersToDelete.length} unverified accounts`,
        totalChecked: listUsersResult.users.length,
        deleted: usersToDelete.length,
        details: userDetails,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'No unverified accounts found older than 7 days',
        totalChecked: listUsersResult.users.length,
        deleted: 0,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error during manual cleanup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup unverified accounts',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

export const checkAccountStatus = functions.https.onCall(async (_data: unknown, context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const uid = context.auth.uid;

  try {
    const user = await admin.auth().getUser(uid);
    const createdAt = new Date(user.metadata.creationTime).getTime();
    const now = Date.now();
    const accountAge = Math.floor((now - createdAt) / (24 * 60 * 60 * 1000));

    return {
      emailVerified: user.emailVerified,
      accountAge: accountAge,
      willBeDeletedIn: user.emailVerified ? null : Math.max(0, 7 - accountAge),
      createdAt: user.metadata.creationTime
    };
  } catch (error) {
    console.error('Error checking account status:', error);
    throw new functions.https.HttpsError('internal', 'Failed to check account status');
  }
});


