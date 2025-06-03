import { useSurvey } from '@/context/SurveyContext';
import { useState, useEffect } from 'react';

// 타입 정의
interface ResourceErrors {
  node: boolean;
  cpu: boolean;
  ram: boolean;
  disk: boolean;
  ebsSize: boolean;
}

interface LocalResources {
  cpu: string;
  ram: string;
  disk: string;
}

interface LocalVM {
  ec2Type: string;
  ebsType: string;
  ebsSize: string;
}

// ✅ 강화된 입력 검증 함수
const validateAndSanitizeInput = (value: string): { isValid: boolean; sanitizedValue: string } => {
  // 빈 문자열은 허용
  if (value === '') {
    return { isValid: true, sanitizedValue: '' };
  }
  
  // 숫자가 아닌 문자 제거
  const numericOnly = value.replace(/\D/g, '');
  
  if (numericOnly === '') {
    return { isValid: false, sanitizedValue: '' };
  }
  
  const numValue = parseInt(numericOnly, 10);
  const isValid = !isNaN(numValue) && numValue > 0;
  
  return { 
    isValid, 
    sanitizedValue: isValid ? numericOnly : '' 
  };
};

// ✅ 키보드 입력 이벤트 핸들러 - 음수 기호와 문자 입력 차단
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  // 허용할 키: 숫자, 백스페이스, 삭제, 탭, 화살표 키, Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
  const allowedKeys = [
    'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Home', 'End'
  ];
  
  const isNumber = e.key >= '0' && e.key <= '9';
  const isAllowedKey = allowedKeys.includes(e.key);
  const isCtrlKey = e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase());
  
  // 음수 기호(-), 점(.), 문자 등 차단
  if (!isNumber && !isAllowedKey && !isCtrlKey) {
    e.preventDefault();
  }
};

// 에러 메시지 컴포넌트
const ErrorMessage = ({ id, message }: { id: string; message: string }) => (
  <p id={id} className="text-red-500 text-xs mt-1" role="alert">
    {message}
  </p>
);

// 입력 필드 컴포넌트
const NumberInput = ({ 
  id, 
  label, 
  value, 
  onChange, 
  onPaste,
  placeholder, 
  hasError, 
  errorMessage 
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  hasError: boolean;
  errorMessage: string;
}) => (
  <div>
    <label htmlFor={id} className="block mb-1 text-sm font-medium">{label}</label>
    <input
      id={id}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      onPaste={onPaste}
      className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary ${
        hasError ? 'border-red-500' : ''
      }`}
      placeholder={placeholder}
      aria-describedby={hasError ? `${id}-error` : undefined}
    />
    {hasError && <ErrorMessage id={`${id}-error`} message={errorMessage} />}
  </div>
);

// 선택 필드 컴포넌트
const SelectField = ({ 
  id, 
  label, 
  value, 
  onChange, 
  options 
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) => (
  <div>
    <label htmlFor={id} className="block mb-1 text-sm font-medium">{label}</label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-input-dark dark:text-white"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// EKS 환경 렌더링 컴포넌트
const EKSResourceFields = ({ 
  localVM, 
  errors, 
  handleVmChange,
  handlePaste
}: {
  localVM: LocalVM;
  errors: ResourceErrors;
  handleVmChange: (field: keyof LocalVM, value: string) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLInputElement>, field: string) => void;
}) => {
  const ec2Options = [
    { value: '', label: '선택하세요' },
    { value: 't2.small', label: 't2.small (1vCPU X 2GiB)' },
    { value: 't3.medium', label: 't3.medium (2vCPU X 4GiB)' },
    { value: 't3.large', label: 't3.large (2vCPU X 8GiB)' },
    { value: 't4g.xlarge', label: 't4g.xlarge (4vCPU X 16GiB)' },
    { value: 'm5.large', label: 'm5.large (2vCPU X 8GiB)' }
  ];

  const ebsOptions = [
    { value: '', label: '선택하세요' },
    { value: 'gp3', label: 'gp3 (SSD)' },
    { value: 'gp2', label: 'gp2 (SSD)' },
    { value: 'io1', label: 'io1 (IOPS SSD)' },
    { value: 'io2', label: 'io2 (IOPS SSD)' },
    { value: 'st1', label: 'st1 (HDD)' },
    { value: 'sc1', label: 'sc1 (HDD)' }
  ];

  return (
    <>
      <SelectField
        id="ec2-instance-select"
        label="EC2 인스턴스 타입"
        value={localVM.ec2Type}
        onChange={(value) => handleVmChange('ec2Type', value)}
        options={ec2Options}
      />

      <SelectField
        id="ebs-volume-select"
        label="EBS 볼륨 타입"
        value={localVM.ebsType}
        onChange={(value) => handleVmChange('ebsType', value)}
        options={ebsOptions}
      />

      <NumberInput
        id="ebs-size-input"
        label="EBS 볼륨 크기 (GB)"
        value={localVM.ebsSize}
        onChange={(value) => handleVmChange('ebsSize', value)}
        onPaste={(e) => handlePaste(e, 'ebsSize')}
        placeholder="예: 50"
        hasError={errors.ebsSize}
        errorMessage="EBS 볼륨 크기는 1 이상의 양수를 입력해주세요."
      />
    </>
  );
};

// 온프레미스 환경 렌더링 컴포넌트
const OnPremiseResourceFields = ({ 
  localResources, 
  errors, 
  handleResourceChange,
  handlePaste
}: {
  localResources: LocalResources;
  errors: ResourceErrors;
  handleResourceChange: (field: keyof LocalResources, value: string) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLInputElement>, field: string) => void;
}) => (
  <>
    <NumberInput
      id="cpu-cores-input"
      label="CPU (cores)"
      value={localResources.cpu}
      onChange={(value) => handleResourceChange('cpu', value)}
      onPaste={(e) => handlePaste(e, 'cpu')}
      placeholder="예: 4"
      hasError={errors.cpu}
      errorMessage="CPU는 1 이상의 양수를 입력해주세요."
    />

    <NumberInput
      id="ram-gb-input"
      label="RAM (GB)"
      value={localResources.ram}
      onChange={(value) => handleResourceChange('ram', value)}
      onPaste={(e) => handlePaste(e, 'ram')}
      placeholder="예: 16"
      hasError={errors.ram}
      errorMessage="RAM은 1 이상의 양수를 입력해주세요."
    />

    <NumberInput
      id="disk-gb-input"
      label="DISK (GB)"
      value={localResources.disk}
      onChange={(value) => handleResourceChange('disk', value)}
      onPaste={(e) => handlePaste(e, 'disk')}
      placeholder="예: 100"
      hasError={errors.disk}
      errorMessage="DISK는 1 이상의 양수를 입력해주세요."
    />
  </>
);

export default function Step3_Resources() {
  const { formData, updateFormData } = useSurvey();
  const initialK8s = formData.k8s ?? {};
  const initialRes = formData.resources ?? {};
  const initialVM = formData.vm ?? {};

  const [localResources, setLocalResources] = useState<LocalResources>({
    cpu: initialRes.cpu ?? '',
    ram: initialRes.ram ?? '',
    disk: initialRes.disk ?? ''
  });

  const [localVM, setLocalVM] = useState<LocalVM>({
    ec2Type: initialVM.ec2Type ?? '',
    ebsType: initialVM.ebsType ?? '',
    ebsSize: initialVM.ebsSize ?? ''
  });

  const [errors, setErrors] = useState<ResourceErrors>({
    node: false,
    cpu: false,
    ram: false,
    disk: false,
    ebsSize: false
  });

  const isEksEnvironment = initialK8s.type === 'amazon_eks';

  // 이펙트 훅들
  useEffect(() => {
    updateFormData('resources', {
      ...formData.resources,
      ...localResources
    });
  }, [localResources, formData.resources, updateFormData]);

  useEffect(() => {
    updateFormData('vm', {
      ...formData.vm,
      ...localVM
    });
  }, [localVM, formData.vm, updateFormData]);

  // 이벤트 핸들러들
  const handleResourceChange = (field: keyof LocalResources, value: string) => {
    const { isValid, sanitizedValue } = validateAndSanitizeInput(value);
    setErrors(prev => ({ ...prev, [field]: !isValid && sanitizedValue !== '' }));
    setLocalResources(prev => ({ ...prev, [field]: sanitizedValue }));
  };

  const handleVmChange = (field: keyof LocalVM, value: string) => {
    if (field === 'ebsSize') {
      const { isValid, sanitizedValue } = validateAndSanitizeInput(value);
      setErrors(prev => ({ ...prev, ebsSize: !isValid && sanitizedValue !== '' }));
      setLocalVM(prev => ({ ...prev, [field]: sanitizedValue }));
    } else {
      setLocalVM(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNodeChange = (value: string) => {
    const { isValid, sanitizedValue } = validateAndSanitizeInput(value);
    setErrors(prev => ({ ...prev, node: !isValid && sanitizedValue !== '' }));
    updateFormData('k8s', { ...formData.k8s, node: sanitizedValue });
  };

  // ✅ 붙여넣기 이벤트 핸들러 - 숫자만 허용
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, field: string) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const numericOnly = pastedText.replace(/\D/g, '');
    
    if (numericOnly) {
      if (field === 'node') {
        handleNodeChange(numericOnly);
      } else if (field === 'ebsSize') {
        handleVmChange(field, numericOnly);
      } else {
        handleResourceChange(field as keyof LocalResources, numericOnly);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">
        <NumberInput
          id="worker-nodes-input"
          label="Worker Node 수"
          value={formData.k8s?.node ?? ''}
          onChange={handleNodeChange}
          onPaste={(e) => handlePaste(e, 'node')}
          placeholder="예: 3"
          hasError={errors.node}
          errorMessage="Worker Node 수는 1 이상의 양수를 입력해주세요."
        />
        
        {isEksEnvironment ? (
          <EKSResourceFields 
            localVM={localVM} 
            errors={errors} 
            handleVmChange={handleVmChange}
            handlePaste={handlePaste}
          />
        ) : (
          <OnPremiseResourceFields 
            localResources={localResources} 
            errors={errors} 
            handleResourceChange={handleResourceChange}
            handlePaste={handlePaste}
          />
        )}
      </div>
    </div>
  );
}