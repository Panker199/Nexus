import React, { useState } from 'react';
import {
  FileText, Upload, Download, Trash2, Share2, HardDrive,
  Pen, Eye, FileSignature, X
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { SignaturePad } from '../../components/ui/SignaturePad';
import { useAuth } from '../../context/AuthContext';
import {
  chamberDocuments, getDocumentsForUser, getDocumentsByStatus,
  addDocument, updateDocumentStatus, removeDocument,
} from '../../data/documents';
import { Document, DocumentStatus } from '../../types';

const statusConfig: Record<DocumentStatus, { label: string; variant: 'warning' | 'primary' | 'success' }> = {
  draft: { label: 'Draft', variant: 'warning' },
  in_review: { label: 'In Review', variant: 'primary' },
  signed: { label: 'Signed', variant: 'success' },
};

export const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<DocumentStatus | 'all'>('all');
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showSign, setShowSign] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({ name: '', type: 'PDF', size: '' });

  if (!user) return null;

  const documents = filter === 'all'
    ? getDocumentsForUser(user.id)
    : getDocumentsByStatus(user.id, filter);

  const counts = {
    all: getDocumentsForUser(user.id).length,
    draft: getDocumentsByStatus(user.id, 'draft').length,
    in_review: getDocumentsByStatus(user.id, 'in_review').length,
    signed: getDocumentsByStatus(user.id, 'signed').length,
  };

  const showMsg = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 2500);
  };

  const handleUpload = () => {
    if (!uploadForm.name) return;
    addDocument(uploadForm.name, uploadForm.type, uploadForm.size || '—', user.id);
    setUploadForm({ name: '', type: 'PDF', size: '' });
    setShowUpload(false);
    showMsg('Document uploaded');
  };

  const handleSign = (dataUrl: string) => {
    if (!previewDoc) return;
    updateDocumentStatus(previewDoc.id, 'signed', user.id);
    setPreviewDoc({ ...previewDoc, status: 'signed', signedBy: user.id });
    setShowSign(false);
    showMsg('Document signed successfully');
  };

  const handleDelete = (docId: string) => {
    removeDocument(docId);
    setPreviewDoc(null);
    showMsg('Document deleted');
  };

  const handleSendForReview = (docId: string) => {
    updateDocumentStatus(docId, 'in_review');
    setPreviewDoc(null);
    showMsg('Sent for review');
  };

  const sidebarFilters: { key: typeof filter; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All Documents', icon: <FileText size={16} /> },
    { key: 'draft', label: 'Drafts', icon: <Pen size={16} /> },
    { key: 'in_review', label: 'In Review', icon: <Eye size={16} /> },
    { key: 'signed', label: 'Signed', icon: <FileSignature size={16} /> },
  ];

  return (
    <div className="space-y-6 page-entrance">
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded bg-primary-50 flex items-center justify-center flex-shrink-0">
            <FileText size={20} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Document Chamber</h1>
            <p className="text-sm text-gray-500 mt-0.5">Upload, review, and sign deals & contracts</p>
          </div>
        </div>
        <Button onClick={() => setShowUpload(true)} leftIcon={<Upload size={18} />}>Upload Document</Button>
      </div>

      {statusMsg && (
        <div className="bg-success-50 border border-success-200 text-success-700 text-sm px-4 py-2.5 rounded flex items-center gap-2">
          <FileSignature size={16} />
          {statusMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1 self-start">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HardDrive size={16} className="text-primary-600" />
              <h2 className="text-sm font-semibold text-gray-900">Document Chamber</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-1">
            {sidebarFilters.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded transition-colors ${
                  filter === f.key ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">{f.icon} {f.label}</span>
                <Badge variant={filter === f.key ? 'primary' : 'gray'} size="sm">{counts[f.key]}</Badge>
              </button>
            ))}
          </CardBody>
        </Card>

        {/* Document list */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-primary-600" />
                <h2 className="text-sm font-semibold text-gray-900">
                  {filter === 'all' ? 'All Documents' : `${statusConfig[filter].label} Documents`}
                </h2>
              </div>
              <span className="text-xs text-gray-500">{documents.length} document{documents.length !== 1 ? 's' : ''}</span>
            </CardHeader>
            <CardBody>
              {documents.length === 0 ? (
                <div className="text-center py-10">
                  <FileText size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No documents found</p>
                </div>
              ) : (
                <div className="space-y-1 stagger-list">
                  {documents.map(doc => {
                    const cfg = statusConfig[doc.status];
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center p-3 hover:bg-gray-50 rounded group cursor-pointer"
                        onClick={() => setPreviewDoc(doc)}
                      >
                        <div className="p-2.5 bg-primary-50 rounded mr-4">
                          <FileText size={20} className="text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h3>
                            <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                            {doc.shared && <Badge variant="gray" size="sm">Shared</Badge>}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                            <span>{doc.type}</span>
                            <span>{doc.size}</span>
                            <span>{doc.lastModified}</span>
                            {doc.signedBy && <span className="text-success-600 font-medium">Signed</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="xs" className="p-2" aria-label="Download" onClick={e => { e.stopPropagation(); showMsg('Download started'); }}>
                            <Download size={16} />
                          </Button>
                          <Button variant="ghost" size="xs" className="p-2" aria-label="Share" onClick={e => { e.stopPropagation(); showMsg('Shared'); }}>
                            <Share2 size={16} />
                          </Button>
                          <Button variant="ghost" size="xs" className="p-2 text-error-500 hover:text-error-700" aria-label="Delete" onClick={e => { e.stopPropagation(); handleDelete(doc.id); }}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Upload Document" maxWidth="max-w-md">
        <div className="space-y-4">
          <Input label="Document Name" placeholder="e.g. Investment Agreement" value={uploadForm.name} onChange={e => setUploadForm({ ...uploadForm, name: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
            <select value={uploadForm.type} onChange={e => setUploadForm({ ...uploadForm, type: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option>PDF</option>
              <option>Document</option>
              <option>Spreadsheet</option>
            </select>
          </div>
          <Input label="Size (optional)" placeholder="e.g. 1.5 MB" value={uploadForm.size} onChange={e => setUploadForm({ ...uploadForm, size: e.target.value })} />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
            <Upload size={24} className="text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Drop file here or click to browse</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowUpload(false)}>Cancel</Button>
            <Button onClick={handleUpload} disabled={!uploadForm.name}>Upload</Button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal open={!!previewDoc && !showSign} onClose={() => { setPreviewDoc(null); setShowSign(false); }} title={previewDoc?.name ?? ''} maxWidth="max-w-2xl">
        {previewDoc && (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-50 rounded">
                  <FileText size={24} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{previewDoc.name}</p>
                  <p className="text-xs text-gray-500">{previewDoc.type} &middot; {previewDoc.size}</p>
                </div>
              </div>
              <Badge variant={statusConfig[previewDoc.status].variant} size="md">
                {statusConfig[previewDoc.status].label}
              </Badge>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 min-h-[200px] flex items-center justify-center">
              <div className="text-center">
                <FileText size={40} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Document preview</p>
                <p className="text-xs text-gray-400 mt-1">{previewDoc.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Last modified:</span> <span className="text-gray-900 font-medium">{previewDoc.lastModified}</span></div>
              <div><span className="text-gray-500">Type:</span> <span className="text-gray-900 font-medium">{previewDoc.type}</span></div>
              <div><span className="text-gray-500">Size:</span> <span className="text-gray-900 font-medium">{previewDoc.size}</span></div>
              <div><span className="text-gray-500">Status:</span> <Badge variant={statusConfig[previewDoc.status].variant} size="sm">{statusConfig[previewDoc.status].label}</Badge></div>
            </div>

            {previewDoc.status === 'signed' && previewDoc.signedBy && (
              <div className="bg-success-50 border border-success-200 rounded p-3 flex items-center gap-2 text-sm text-success-700">
                <FileSignature size={16} />
                Signed by {previewDoc.signedBy === user.id ? 'you' : 'the counterparty'}
              </div>
            )}

            <div className="flex justify-between pt-2">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" leftIcon={<Download size={16} />}>Download</Button>
                {previewDoc.status !== 'signed' && (
                  <Button variant="ghost" size="sm" className="text-error-500" leftIcon={<Trash2 size={16} />} onClick={() => handleDelete(previewDoc.id)}>Delete</Button>
                )}
              </div>
              <div className="flex gap-2">
                {previewDoc.status === 'draft' && (
                  <Button size="sm" onClick={() => handleSendForReview(previewDoc.id)} leftIcon={<Eye size={16} />}>Send for Review</Button>
                )}
                {previewDoc.status === 'in_review' && (
                  <Button size="sm" onClick={() => setShowSign(true)} leftIcon={<FileSignature size={16} />}>Sign Document</Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Signature Modal */}
      <Modal open={showSign} onClose={() => setShowSign(false)} title="Sign Document" maxWidth="max-w-lg">
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-700 flex items-start gap-2">
            <FileSignature size={16} className="mt-0.5 shrink-0" />
            <span>Draw your signature below. This represents your electronic signature and is legally binding.</span>
          </div>
          <p className="text-sm font-medium text-gray-700">Signature</p>
          <SignaturePad onSave={handleSign} width={500} height={160} />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowSign(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
