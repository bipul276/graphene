import { useState } from 'react';
import { FileText, User, Calendar, Hash, Upload, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { api } from './utils/api';

interface IssuePageProps {
  institutionName: string;
  issuerId: string;
  isLoggedIn: boolean;
  onNavigate: (page: string) => void;
}

export function IssuePage({ institutionName, issuerId, isLoggedIn, onNavigate }: IssuePageProps) {
  const [studentName, setStudentName] = useState('');
  const [certificateTitle, setCertificateTitle] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; certificateId?: string; tx?: string; error?: string } | null>(null);

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-4">
        <Alert className="max-w-xl border-[#1A237E] bg-blue-50">
          <AlertDescription>
            You need to sign in to issue certificates{' '}
            <button type="button" onClick={() => onNavigate('login')} className="text-[#1A237E] underline">
              Go to Login
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setResult({ ok: false, error: 'Please attach a certificate PDF or image.' });
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const resp = await api.issueCertificate({
        file,
        studentName: studentName.trim(),
        certificateTitle: certificateTitle.trim(),
        issueDate,
        issuerId,
      });
      setResult({ ok: true, certificateId: resp.certificateId, tx: resp.transactionHash });
      setStudentName('');
      setCertificateTitle('');
      setIssueDate('');
      setFile(null);
    } catch (err: any) {
      setResult({ ok: false, error: err?.message || 'Issuance failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white border-0 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#1A237E]">Issue New Certificate</CardTitle>
            <p className="text-gray-600 mt-2">
              Institution: <span className="font-semibold text-[#1A237E]">{institutionName}</span> • Issuer ID:{' '}
              <span className="font-mono">{issuerId}</span>
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              {result && !result.ok && (
                <Alert className="border-red-500 bg-red-50">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-red-700">{result.error}</AlertDescription>
                </Alert>
              )}

              {result && result.ok && (
                <Alert className="border-[#4CAF50] bg-green-50">
                  <CheckCircle2 className="h-5 w-5 text-[#4CAF50]" />
                  <AlertDescription>
                    Successfully issued certificate!<br />
                    <span className="font-mono">Certificate ID:</span> <span className="font-mono">{result.certificateId}</span>
                    <br />
                    <span className="font-mono">Tx Hash:</span> <span className="font-mono break-all">{result.tx}</span>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="studentName" className="flex items-center mb-2">
                    <User className="h-4 w-4 mr-2 text-[#1A237E]" />
                    Student Name
                  </Label>
                  <Input
                    id="studentName"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="issueDate" className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-[#1A237E]" />
                    Issue Date
                  </Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="title" className="flex items-center mb-2">
                    <FileText className="h-4 w-4 mr-2 text-[#1A237E]" />
                    Certificate Title
                  </Label>
                  <Input
                    id="title"
                    value={certificateTitle}
                    onChange={(e) => setCertificateTitle(e.target.value)}
                    placeholder="Bachelor of Science in Computer Science"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="file" className="flex items-center mb-2">
                    <Upload className="h-4 w-4 mr-2 text-[#1A237E]" />
                    Certificate Document (PDF/PNG/JPG)
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="flex items-center mb-2">
                    <Hash className="h-4 w-4 mr-2 text-[#1A237E]" />
                    Issuer ID
                  </Label>
                  <Input value={issuerId} readOnly className="bg-gray-50" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={submitting} className="bg-[#1A237E] hover:bg-[#0D47A1] text-white">
                  {submitting ? 'Issuing...' : 'Issue Certificate'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

