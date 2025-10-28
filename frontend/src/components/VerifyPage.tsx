// src/components/VerifyPage.tsx
import { useState } from 'react';
import { Upload, Hash, Building, Search, CheckCircle2, XCircle, FileText, Shield, ChevronLeft, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { api,type VerificationResult } from './utils/api';

interface VerifyPageProps {
  onNavigate: (page: string) => void;
}

export function VerifyPage({ onNavigate }: VerifyPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    file: null as File | null,
    certificateId: '',
    issuerId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const stepTitles = ['Upload Document', 'Provide Details', 'Verify & Confirm'];
  const stepDescriptions = [
    'Upload your certificate document for verification',
    'Enter the certificate and issuer identification details',
    'Review your information and complete verification',
  ];

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.file) newErrors.file = 'Certificate document is required';
    } else if (currentStep === 2) {
      if (!formData.certificateId.trim()) newErrors.certificateId = 'Certificate ID is required';
      if (!formData.issuerId.trim()) newErrors.issuerId = 'Issuer ID is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 3) setCurrentStep(currentStep + 1);
      else handleSubmit();
    }
  };

  const handleBack = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleSubmit = async () => {
    if (!formData.file) return;
    setIsVerifying(true);
    setApiError(null);
    setVerificationResult(null);

    try {
      const result = await api.verifyCertificate({
        file: formData.file,
        certificateId: formData.certificateId.trim(),
        issuerId: formData.issuerId.trim(),
      });
      setVerificationResult(result);
    } catch (e: any) {
      setApiError(e.message || 'Verification failed');
      setVerificationResult({
        isValid: false,
        errorMessage: 'Verification service unavailable. Please try again.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, file }));
    if (errors.file) setErrors((prev) => ({ ...prev, file: '' }));
  };

  const resetVerification = () => {
    setVerificationResult(null);
    setCurrentStep(1);
    setFormData({ file: null, certificateId: '', issuerId: '' });
    setErrors({});
    setApiError(null);
  };

  // RESULTS
  if (verificationResult) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white shadow-xl rounded-2xl border-0">
            <CardContent className="p-12 text-center">
              <div
                className={`rounded-full p-6 w-20 h-20 mx-auto mb-8 flex items-center justify-center ${
                  verificationResult.isValid ? 'bg-[#4CAF50]' : 'bg-[#F44336]'
                }`}
              >
                {verificationResult.isValid ? (
                  <CheckCircle2 className="h-10 w-10 text-white" />
                ) : (
                  <XCircle className="h-10 w-10 text-white" />
                )}
              </div>

              <h1 className="text-3xl font-bold text-[#1A237E] mb-6">
                {verificationResult.isValid ? 'Certificate Verified!' : 'Verification Failed'}
              </h1>

              {verificationResult.isValid ? (
                <>
                  <p className="text-lg text-gray-600 mb-8">
                    This certificate is authentic and has been verified on the blockchain.
                  </p>

                  <div className="space-y-4 text-left bg-gray-50 p-6 rounded-lg mb-8">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Student:</span>
                      <span className="text-[#1A237E] font-medium">{verificationResult.studentName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Certificate:</span>
                      <span className="text-[#1A237E] font-medium">{verificationResult.certificateTitle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Issued By:</span>
                      <span className="text-[#1A237E] font-medium">{verificationResult.institutionName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Issue Date:</span>
                      <span className="text-[#1A237E] font-medium">{verificationResult.issueDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Blockchain Hash:</span>
                      <span className="font-mono text-[#1A237E] font-medium text-sm break-all">
                        {verificationResult.blockchainHash}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg text-gray-600 mb-8">
                    {verificationResult.errorMessage || 'Unable to verify this certificate.'}
                  </p>

                  <Alert className="mb-8 border-[#F44336] bg-red-50">
                    <XCircle className="h-5 w-5 text-[#F44336]" />
                    <AlertDescription className="text-left">
                      <div className="font-semibold text-[#F44336] mb-2">Possible reasons:</div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Certificate ID or Issuer ID is incorrect</li>
                        <li>• Certificate was not issued through our platform</li>
                        <li>• Document has been tampered with</li>
                      </ul>
                      {apiError && <p className="mt-3 text-xs text-[#F44336]">Details: {apiError}</p>}
                    </AlertDescription>
                  </Alert>
                </>
              )}

              <div className="space-y-4">
                <Button onClick={resetVerification} size="lg" className="bg-[#1A237E] hover:bg-[#0D47A1] text-white px-8 py-3 w-full">
                  Verify Another Certificate
                </Button>

                <Button
                  onClick={() => onNavigate('home')}
                  variant="outline"
                  size="lg"
                  className="border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white px-8 py-3 w-full"
                >
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // WIZARD
  return (
    <div className="min-h-screen bg-[#F4F6F9] pt-24 pb-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-[#1A237E]">Verify Certificate</h1>
            <div className="text-sm font-medium text-gray-500">Step {currentStep} of 3</div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Progress value={(currentStep / 3) * 100} className="h-2" />
            <div className="flex justify-between mt-2">
              {['Upload Document', 'Provide Details', 'Verify & Confirm'].map((title, index) => (
                <div
                  key={index}
                  className={`flex items-center text-sm font-medium ${index + 1 <= currentStep ? 'text-[#1A237E]' : 'text-gray-400'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                      index + 1 < currentStep
                        ? 'bg-[#4CAF50] text-white'
                        : index + 1 === currentStep
                        ? 'bg-[#1A237E] text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {index + 1 < currentStep ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs">{index + 1}</span>}
                  </div>
                  <span className="hidden sm:inline">{title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="bg-white shadow-xl rounded-2xl border-0">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-[#1A237E] text-center">
              {stepTitles[currentStep - 1]}
            </CardTitle>
            <p className="text-gray-600 text-center mt-2">{stepDescriptions[currentStep - 1]}</p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="certificate-file" className="flex items-center mb-3">
                    <FileText className="h-5 w-5 mr-2 text-[#1A237E]" />
                    Certificate Document *
                  </Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      errors.file ? 'border-[#F44336] bg-red-50' : 'border-gray-300 hover:border-[#1A237E] hover:bg-gray-50'
                    }`}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <div className="font-medium text-gray-700">
                        {formData.file ? formData.file.name : 'Choose a file or drag it here'}
                      </div>
                      <div className="text-sm text-gray-500">PDF, PNG, JPG up to 10MB</div>
                      <input id="certificate-file" type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} className="hidden" />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('certificate-file')?.click()}
                        className="mt-4"
                      >
                        Browse Files
                      </Button>
                    </div>
                  </div>
                  {errors.file && (
                    <p className="text-[#F44336] text-sm mt-2 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {errors.file}
                    </p>
                  )}
                </div>

                <Alert className="border-[#1A237E] bg-blue-50">
                  <Shield className="h-5 w-5 text-[#1A237E]" />
                  <AlertDescription>
                    <div className="font-semibold text-[#1A237E] mb-1">Secure Upload</div>
                    <div className="text-sm text-gray-600">Your document is processed securely and never stored without consent.</div>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="certificateId" className="flex items-center mb-3">
                    <Hash className="h-5 w-5 mr-2 text-[#1A237E]" />
                    Certificate ID *
                  </Label>
                  <Input
                    id="certificateId"
                    placeholder="e.g., CERT-2024-001234"
                    value={formData.certificateId}
                    onChange={(e) => handleInputChange('certificateId', e.target.value)}
                    className={`${errors.certificateId ? 'border-[#F44336]' : ''}`}
                  />
                  {errors.certificateId && (
                    <p className="text-[#F44336] text-sm mt-1 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {errors.certificateId}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Find this ID on your certificate document</p>
                </div>

                <div>
                  <Label htmlFor="issuerId" className="flex items-center mb-3">
                    <Building className="h-5 w-5 mr-2 text-[#1A237E]" />
                    Issuer ID *
                  </Label>
                  <Input
                    id="issuerId"
                    placeholder="e.g., GR-UPENN2024"
                    value={formData.issuerId}
                    onChange={(e) => handleInputChange('issuerId', e.target.value)}
                    className={`${errors.issuerId ? 'border-[#F44336]' : ''}`}
                  />
                  {errors.issuerId && (
                    <p className="text-[#F44336] text-sm mt-1 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      {errors.issuerId}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">The unique identifier of the issuing institution</p>
                </div>

                <Alert className="border-[#1A237E] bg-blue-50">
                  <Search className="h-5 w-5 text-[#1A237E]" />
                  <AlertDescription>
                    <div className="font-semibold text-[#1A237E] mb-1">Need Help Finding IDs?</div>
                    <div className="text-sm text-gray-600 mb-2">
                      These identifiers are typically found on your certificate document or in your notification email.
                    </div>
                    <Button variant="link" className="text-[#1A237E] p-0 h-auto text-sm" onClick={() => onNavigate('issuers')}>
                      View Public Registry →
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <h3 className="font-semibold text-[#1A237E] mb-4">Review Your Information</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Document:</span>
                      <span className="text-[#1A237E] font-medium text-right max-w-48 truncate">{formData.file?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Certificate ID:</span>
                      <span className="font-mono text-[#1A237E] font-medium">{formData.certificateId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Issuer ID:</span>
                      <span className="font-mono text-[#1A237E] font-medium">{formData.issuerId}</span>
                    </div>
                  </div>
                </div>

                <Alert className="border-[#4CAF50] bg-green-50">
                  <Shield className="h-5 w-5 text-[#4CAF50]" />
                  <AlertDescription>
                    <div className="font-semibold text-[#4CAF50] mb-1">Ready to Verify</div>
                    <div className="text-sm text-gray-600">
                      We'll check your certificate against our blockchain registry to confirm its authenticity.
                    </div>
                  </AlertDescription>
                </Alert>

                {isVerifying && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A237E] mx-auto mb-4"></div>
                    <p className="text-[#1A237E] font-medium">Verifying certificate...</p>
                    <p className="text-sm text-gray-500 mt-1">Checking blockchain registry</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            {!isVerifying && (
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={currentStep === 1 ? () => onNavigate('home') : handleBack}
                  className="text-gray-600 hover:text-[#1A237E]"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  {currentStep === 1 ? 'Cancel' : 'Back'}
                </Button>

                <Button
                  onClick={handleNext}
                  className="bg-[#1A237E] hover:bg-[#0D47A1] text-white px-6"
                  disabled={isVerifying}
                >
                  {currentStep === 3 ? 'Verify Certificate' : 'Continue'}
                  {currentStep < 3 && <ArrowRight className="h-4 w-4 ml-2" />}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

