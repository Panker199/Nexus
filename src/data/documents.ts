import { Document } from '../types';
import { format, subDays } from 'date-fns';

const today = new Date();

export const chamberDocuments: Document[] = [
  {
    id: 'd1', name: 'Pitch Deck 2026.pdf', type: 'PDF', size: '2.4 MB',
    lastModified: format(subDays(today, 0), 'yyyy-MM-dd'), shared: false,
    url: '#', ownerId: 'u1', status: 'draft',
  },
  {
    id: 'd2', name: 'Investment Term Sheet.docx', type: 'Document', size: '1.1 MB',
    lastModified: format(subDays(today, 1), 'yyyy-MM-dd'), shared: true,
    url: '#', ownerId: 'u1', status: 'in_review',
  },
  {
    id: 'd3', name: 'Non-Disclosure Agreement.pdf', type: 'PDF', size: '0.8 MB',
    lastModified: format(subDays(today, 3), 'yyyy-MM-dd'), shared: true,
    url: '#', ownerId: 'u1', status: 'signed', signedBy: 'u4',
  },
  {
    id: 'd4', name: 'Financial Projections.xlsx', type: 'Spreadsheet', size: '1.8 MB',
    lastModified: format(subDays(today, 5), 'yyyy-MM-dd'), shared: false,
    url: '#', ownerId: 'u1', status: 'draft',
  },
  {
    id: 'd5', name: 'Partnership Agreement.pdf', type: 'PDF', size: '3.2 MB',
    lastModified: format(subDays(today, 7), 'yyyy-MM-dd'), shared: true,
    url: '#', ownerId: 'u2', status: 'in_review',
  },
  {
    id: 'd6', name: 'Funding Proposal.docx', type: 'Document', size: '2.0 MB',
    lastModified: format(subDays(today, 2), 'yyyy-MM-dd'), shared: true,
    url: '#', ownerId: 'u1', status: 'signed', signedBy: 'u5',
  },
];

export const getDocumentsForUser = (userId: string): Document[] =>
  chamberDocuments.filter(d => d.ownerId === userId || d.shared);

export const getDocumentsByStatus = (userId: string, status: Document['status']): Document[] =>
  getDocumentsForUser(userId).filter(d => d.status === status);

export const addDocument = (
  name: string, type: string, size: string, ownerId: string, content?: string,
): Document => {
  const doc: Document = {
    id: `d${Date.now()}`, name, type, size,
    lastModified: format(today, 'yyyy-MM-dd'), shared: false,
    url: '#', ownerId, status: 'draft', content,
  };
  chamberDocuments.push(doc);
  return doc;
};

export const updateDocumentStatus = (docId: string, status: Document['status'], signedBy?: string): Document | null => {
  const doc = chamberDocuments.find(d => d.id === docId);
  if (!doc) return null;
  doc.status = status;
  if (signedBy) doc.signedBy = signedBy;
  doc.lastModified = format(today, 'yyyy-MM-dd');
  return doc;
};

export const removeDocument = (docId: string): boolean => {
  const idx = chamberDocuments.findIndex(d => d.id === docId);
  if (idx === -1) return false;
  chamberDocuments.splice(idx, 1);
  return true;
};
