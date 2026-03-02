import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc as firestoreUpdateDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  DocumentReference,
  QueryConstraint,
  DocumentData,
  Timestamp,
  serverTimestamp,
  writeBatch,
  WriteBatch,
} from 'firebase/firestore';
import { db } from './config';
import type { PortfolioContent, ContactSubmission, Experience, Project, SkillCategory, Skill, Certification, Achievement } from '@/types/portfolio';

// ==================== Generic CRUD Functions ====================

/**
 * Get a single document from Firestore
 * @param collectionName - Name of the collection
 * @param docId - Document ID
 * @returns Promise with document data or null
 */
export const getDocument = async <T = DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }

    console.log(`Document ${docId} not found in ${collectionName}`);
    return null;
  } catch (error) {
    console.error(`Error getting document ${docId} from ${collectionName}:`, error);
    if (error instanceof Error) {
      throw new Error(`Failed to get document: ${error.message}`);
    }
    throw new Error('Failed to get document: Unknown error');
  }
};

/**
 * Get all documents from a collection
 * @param collectionName - Name of the collection
 * @param constraints - Optional query constraints
 * @returns Promise with array of documents
 */
export const getDocuments = async <T = DocumentData>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Add a new document to a collection
 * @param collectionName - Name of the collection
 * @param data - Document data
 * @returns Promise with document reference
 */
export const addDocument = async <T = DocumentData>(
  collectionName: string,
  data: T
): Promise<DocumentReference> => {
  try {
    const collectionRef = collection(db, collectionName);
    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    return await addDoc(collectionRef, docData);
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Set a document (create or overwrite) with merge enabled
 * @param collectionName - Name of the collection
 * @param docId - Document ID
 * @param data - Document data
 * @returns Promise<void>
 */
export const setDocument = async <T = DocumentData>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docData = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, docData, { merge: true });
    console.log(`Document ${docId} set successfully in ${collectionName}`);
  } catch (error) {
    console.error(`Error setting document ${docId} in ${collectionName}:`, error);
    if (error instanceof Error) {
      throw new Error(`Failed to set document: ${error.message}`);
    }
    throw new Error('Failed to set document: Unknown error');
  }
};

/**
 * Update a document
 * @param collectionName - Name of the collection
 * @param docId - Document ID
 * @param data - Partial document data to update
 * @returns Promise<void>
 */
export const updateDocument = async <T = DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    await firestoreUpdateDoc(docRef, updateData);
    console.log(`Document ${docId} updated successfully in ${collectionName}`);
  } catch (error) {
    console.error(`Error updating document ${docId} in ${collectionName}:`, error);
    if (error instanceof Error) {
      throw new Error(`Failed to update document: ${error.message}`);
    }
    throw new Error('Failed to update document: Unknown error');
  }
};

/**
 * Delete a document
 * @param collectionName - Name of the collection
 * @param docId - Document ID
 * @returns Promise<void>
 */
export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log(`Document ${docId} deleted successfully from ${collectionName}`);
  } catch (error) {
    console.error(`Error deleting document ${docId} from ${collectionName}:`, error);
    if (error instanceof Error) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
    throw new Error('Failed to delete document: Unknown error');
  }
};

/**
 * Get all documents from a collection
 * @param collectionName - Name of the collection
 * @returns Promise with array of documents
 */
export const getAllDocuments = async <T = DocumentData>(
  collectionName: string
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);

    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];

    console.log(`Retrieved ${documents.length} documents from ${collectionName}`);
    return documents;
  } catch (error) {
    console.error(`Error getting all documents from ${collectionName}:`, error);
    if (error instanceof Error) {
      throw new Error(`Failed to get documents: ${error.message}`);
    }
    throw new Error('Failed to get documents: Unknown error');
  }
};

// ==================== Portfolio-Specific Functions ====================

/**
 * Get the main portfolio content document
 * @returns Promise with PortfolioContent or null
 */
export const getPortfolioContent = async (): Promise<PortfolioContent | null> => {
  try {
    const content = await getDocument<PortfolioContent>('portfolio_content', 'main');

    if (!content) {
      console.log('Portfolio content not found, returning null');
      return null;
    }

    // Fetch data from external collections that are managed separately
    try {
      const [skillCategories, projects, experiences, certifications, achievements] = await Promise.all([
        getAllDocuments<SkillCategory>('skill_categories').catch(() => []),
        getAllDocuments<Project>('projects').catch(() => []),
        getAllDocuments<Experience>('experiences').catch(() => []),
        getAllDocuments<Certification>('certifications').catch(() => []),
        getAllDocuments<Achievement>('achievements').catch(() => [])
      ]);

      if (skillCategories && skillCategories.length > 0) {
        content.skillCategories = skillCategories;
      }
      if (projects && projects.length > 0) {
        content.projects = projects;
      }
      if (experiences && experiences.length > 0) {
        content.experiences = experiences;
      }
      if (certifications && certifications.length > 0) {
        content.certifications = certifications;
      }
      if (achievements && achievements.length > 0) {
        content.achievements = achievements;
      }
    } catch (colError) {
      console.error('Error fetching separate collections for portfolio:', colError);
      // We do not throw here to still return the hero/about data if collections fail
    }

    return content;
  } catch (error) {
    console.error('Error getting portfolio content:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to get portfolio content: ${error.message}`);
    }
    throw new Error('Failed to get portfolio content: Unknown error');
  }
};

/**
 * Update a specific section of the portfolio
 * @param section - Section name (e.g., 'hero', 'about', 'projects')
 * @param data - Section data to update
 * @returns Promise<void>
 */
export const updatePortfolioSection = async <T = unknown>(
  section: string,
  data: T
): Promise<void> => {
  try {
    const updateData = {
      [section]: data,
      [`metadata.lastUpdated`]: serverTimestamp(),
    };

    await updateDocument('portfolio_content', 'main', updateData);
    console.log(`Portfolio section '${section}' updated successfully`);
  } catch (error) {
    console.error(`Error updating portfolio section '${section}':`, error);
    if (error instanceof Error) {
      throw new Error(`Failed to update portfolio section: ${error.message}`);
    }
    throw new Error('Failed to update portfolio section: Unknown error');
  }
};

/**
 * Submit a contact form
 * @param formData - Contact form data
 * @returns Promise with document ID
 */
export const submitContactForm = async (
  formData: Omit<ContactSubmission, 'id' | 'createdAt' | 'read' | 'replied'>
): Promise<string> => {
  try {
    const submissionData: Omit<ContactSubmission, 'id'> = {
      ...formData,
      read: false,
      replied: false,
      createdAt: serverTimestamp() as Timestamp,
    };

    const collectionRef = collection(db, 'contact_submissions');
    const docRef = await addDoc(collectionRef, submissionData);

    console.log(`Contact form submitted successfully with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to submit contact form: ${error.message}`);
    }
    throw new Error('Failed to submit contact form: Unknown error');
  }
};

/**
 * Get all contact submissions ordered by timestamp (newest first)
 * @returns Promise with array of ContactSubmission
 */
export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
  try {
    const collectionRef = collection(db, 'contact_submissions');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const submissions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ContactSubmission[];

    console.log(`Retrieved ${submissions.length} contact submissions`);
    return submissions;
  } catch (error) {
    console.error('Error getting contact submissions:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to get contact submissions: ${error.message}`);
    }
    throw new Error('Failed to get contact submissions: Unknown error');
  }
};

/**
 * Add a new experience
 * @param experienceData - Experience data
 * @returns Promise with document ID
 */
export const addExperience = async (
  experienceData: Omit<Experience, 'id'>
): Promise<string> => {
  try {
    const collectionRef = collection(db, 'experiences');
    const docRef = await addDoc(collectionRef, {
      ...experienceData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log('Experience added successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding experience:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to add experience: ${error.message}`);
    }
    throw new Error('Failed to add experience: Unknown error');
  }
};

/**
 * Update an existing experience
 * @param id - Experience document ID
 * @param experienceData - Partial experience data to update
 * @returns Promise<void>
 */
export const updateExperience = async (
  id: string,
  experienceData: Partial<Omit<Experience, 'id'>>
): Promise<void> => {
  try {
    await updateDocument('experiences', id, {
      ...experienceData,
      updatedAt: serverTimestamp(),
    });
    console.log('Experience updated successfully:', id);
  } catch (error) {
    console.error('Error updating experience:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to update experience: ${error.message}`);
    }
    throw new Error('Failed to update experience: Unknown error');
  }
};

/**
 * Delete an experience
 * @param id - Experience document ID
 * @returns Promise<void>
 */
export const deleteExperience = async (id: string): Promise<void> => {
  try {
    await deleteDocument('experiences', id);
    console.log('Experience deleted successfully:', id);
  } catch (error) {
    console.error('Error deleting experience:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to delete experience: ${error.message}`);
    }
    throw new Error('Failed to delete experience: Unknown error');
  }
};

/**
 * Add a new project
 * @param projectData - Project data
 * @returns Promise with document ID
 */
export const addProject = async (
  projectData: Omit<Project, 'id'>
): Promise<string> => {
  try {
    const collectionRef = collection(db, 'projects');
    const docRef = await addDoc(collectionRef, {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log('Project added successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding project:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to add project: ${error.message}`);
    }
    throw new Error('Failed to add project: Unknown error');
  }
};

/**
 * Update an existing project
 * @param id - Project document ID
 * @param projectData - Partial project data to update
 * @returns Promise<void>
 */
export const updateProject = async (
  id: string,
  projectData: Partial<Omit<Project, 'id'>>
): Promise<void> => {
  try {
    await updateDocument('projects', id, {
      ...projectData,
      updatedAt: serverTimestamp(),
    });
    console.log('Project updated successfully:', id);
  } catch (error) {
    console.error('Error updating project:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to update project: ${error.message}`);
    }
    throw new Error('Failed to update project: Unknown error');
  }
};

/**
 * Delete a project
 * @param id - Project document ID
 * @returns Promise<void>
 */
export const deleteProject = async (id: string): Promise<void> => {
  try {
    await deleteDocument('projects', id);
    console.log('Project deleted successfully:', id);
  } catch (error) {
    console.error('Error deleting project:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }
    throw new Error('Failed to delete project: Unknown error');
  }
};

/**
 * Add a new skill category
 * @param categoryData - Skill category data
 * @returns Promise with document ID
 */
export const addSkillCategory = async (
  categoryData: Omit<SkillCategory, 'id' | 'skills'>
): Promise<string> => {
  try {
    const collectionRef = collection(db, 'skill_categories');
    const docRef = await addDoc(collectionRef, {
      ...categoryData,
      skills: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log('Skill category added successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding skill category:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to add skill category: ${error.message}`);
    }
    throw new Error('Failed to add skill category: Unknown error');
  }
};

/**
 * Update a skill category
 * @param id - Category document ID
 * @param categoryData - Partial category data to update
 * @returns Promise<void>
 */
export const updateSkillCategory = async (
  id: string,
  categoryData: Partial<Omit<SkillCategory, 'id' | 'skills'>>
): Promise<void> => {
  try {
    await updateDocument('skill_categories', id, {
      ...categoryData,
      updatedAt: serverTimestamp(),
    });
    console.log('Skill category updated successfully:', id);
  } catch (error) {
    console.error('Error updating skill category:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to update skill category: ${error.message}`);
    }
    throw new Error('Failed to update skill category: Unknown error');
  }
};

/**
 * Delete a skill category
 * @param id - Category document ID
 * @returns Promise<void>
 */
export const deleteSkillCategory = async (id: string): Promise<void> => {
  try {
    await deleteDocument('skill_categories', id);
    console.log('Skill category deleted successfully:', id);
  } catch (error) {
    console.error('Error deleting skill category:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to delete skill category: ${error.message}`);
    }
    throw new Error('Failed to delete skill category: Unknown error');
  }
};

/**
 * Add a skill to a category
 * @param categoryId - Category document ID
 * @param skillData - Skill data
 * @returns Promise<void>
 */
export const addSkillToCategory = async (
  categoryId: string,
  skillData: Omit<Skill, 'id'>
): Promise<void> => {
  try {
    const categoryDoc = await getDocument<SkillCategory>('skill_categories', categoryId);
    if (!categoryDoc) {
      throw new Error('Category not found');
    }

    const newSkill: Skill = {
      ...skillData,
      id: `skill-${Date.now()}`,
    };

    const updatedSkills = [...(categoryDoc.skills || []), newSkill];

    await updateDocument('skill_categories', categoryId, {
      skills: updatedSkills,
      updatedAt: serverTimestamp(),
    });

    console.log('Skill added to category successfully');
  } catch (error) {
    console.error('Error adding skill to category:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to add skill to category: ${error.message}`);
    }
    throw new Error('Failed to add skill to category: Unknown error');
  }
};

/**
 * Update a skill in a category
 * @param categoryId - Category document ID
 * @param skillId - Skill ID
 * @param skillData - Partial skill data to update
 * @returns Promise<void>
 */
export const updateSkillInCategory = async (
  categoryId: string,
  skillId: string,
  skillData: Partial<Omit<Skill, 'id'>>
): Promise<void> => {
  try {
    const categoryDoc = await getDocument<SkillCategory>('skill_categories', categoryId);
    if (!categoryDoc) {
      throw new Error('Category not found');
    }

    const updatedSkills = categoryDoc.skills.map(skill =>
      skill.id === skillId ? { ...skill, ...skillData } : skill
    );

    await updateDocument('skill_categories', categoryId, {
      skills: updatedSkills,
      updatedAt: serverTimestamp(),
    });

    console.log('Skill updated in category successfully');
  } catch (error) {
    console.error('Error updating skill in category:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to update skill in category: ${error.message}`);
    }
    throw new Error('Failed to update skill in category: Unknown error');
  }
};

/**
 * Delete a skill from a category
 * @param categoryId - Category document ID
 * @param skillId - Skill ID
 * @returns Promise<void>
 */
export const deleteSkillFromCategory = async (
  categoryId: string,
  skillId: string
): Promise<void> => {
  try {
    const categoryDoc = await getDocument<SkillCategory>('skill_categories', categoryId);
    if (!categoryDoc) {
      throw new Error('Category not found');
    }

    const updatedSkills = categoryDoc.skills.filter(skill => skill.id !== skillId);

    await updateDocument('skill_categories', categoryId, {
      skills: updatedSkills,
      updatedAt: serverTimestamp(),
    });

    console.log('Skill deleted from category successfully');
  } catch (error) {
    console.error('Error deleting skill from category:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to delete skill from category: ${error.message}`);
    }
    throw new Error('Failed to delete skill from category: Unknown error');
  }
};

/**
 * Reorder skills in a category
 * @param categoryId - Category document ID
 * @param skills - Reordered skills array
 * @returns Promise<void>
 */
export const reorderSkillsInCategory = async (
  categoryId: string,
  skills: Skill[]
): Promise<void> => {
  try {
    await updateDocument('skill_categories', categoryId, {
      skills,
      updatedAt: serverTimestamp(),
    });

    console.log('Skills reordered in category successfully');
  } catch (error) {
    console.error('Error reordering skills in category:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to reorder skills in category: ${error.message}`);
    }
    throw new Error('Failed to reorder skills in category: Unknown error');
  }
};

/**
 * Create a batch for multiple writes
 * @returns WriteBatch instance
 */
export const createBatch = (): WriteBatch => {
  return writeBatch(db);
};

// ==================== Exports ====================
export { db } from './config';
export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

export type {
  DocumentReference,
  CollectionReference,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
  WriteBatch,
} from 'firebase/firestore';

