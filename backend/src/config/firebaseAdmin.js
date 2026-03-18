const admin = require('firebase-admin')

// Initialize Firebase Admin SDK
// You need to download your service account key from Firebase Console:
// Firebase Console -> Project Settings -> Service Accounts -> Generate new private key
// Save it as backend/src/config/firebase-service-account.json
// OR use environment variables (recommended for production)

let firebaseAdmin = null

const initFirebaseAdmin = () => {
  if (firebaseAdmin) return firebaseAdmin

  try {
    // Option 1: Use environment variables (recommended)
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        })
      })
      console.log('✅ Firebase Admin initialized with environment variables')
    }
    // Option 2: Use service account JSON file
    else {
      try {
        const serviceAccount = require('./firebase-service-account.json')
        firebaseAdmin = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        })
        console.log('✅ Firebase Admin initialized with service account file')
      } catch (fileError) {
        console.warn('⚠️  Firebase service account file not found. Firebase auth verification will be skipped.')
        console.warn('   To enable Firebase Auth, add FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL to .env')
        console.warn('   OR place firebase-service-account.json in backend/src/config/')
        return null
      }
    }
  } catch (error) {
    console.error('❌ Firebase Admin init error:', error.message)
    return null
  }

  return firebaseAdmin
}

const getFirebaseAdmin = () => {
  if (admin.apps.length > 0) return admin.apps[0]
  return initFirebaseAdmin()
}

/**
 * Verify a Firebase ID token
 * Returns decoded token or null if invalid
 */
const verifyFirebaseToken = async (idToken) => {
  try {
    const app = getFirebaseAdmin()
    if (!app) return null
    
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    return decodedToken
  } catch (error) {
    console.error('Firebase token verification error:', error.message)
    return null
  }
}

// Initialize on module load
initFirebaseAdmin()

module.exports = { verifyFirebaseToken, getFirebaseAdmin }
