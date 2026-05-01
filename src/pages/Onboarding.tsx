import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Baby, 
  Calendar, 
  Weight, 
  Droplet,
  ArrowLeft,
  Sparkles,
  LogIn
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BabyProfile } from '../types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const STEPS = [
  {
    id: 'auth',
    title: 'Bắt đầu ngay',
    description: 'Để lưu lại hành trình của bé, hãy đăng nhập trước nhé!',
    icon: <LogIn className="text-white" size={32} />
  },
  {
    id: 'name',
    title: 'Tên bé là gì?',
    description: 'Bên mình sẽ cá nhân hóa các gợi ý sản phẩm dành riêng cho bé.',
    icon: <Baby className="text-white" size={32} />
  },
  {
    id: 'dob',
    title: 'Ngày dự sinh / ngày sinh?',
    description: 'Để biết bé đang ở giai đoạn phát triển nào.',
    icon: <Calendar className="text-white" size={32} />
  },
  {
    id: 'weight',
    title: 'Cân nặng của bé?',
    description: 'Cân nặng giúp gợi ý size tã vừa vặn nhất cho bé.',
    icon: <Weight className="text-white" size={32} />
  },
  {
    id: 'skin',
    title: 'Đặc điểm làn da?',
    description: 'Da trẻ em rất nhạy cảm, chúng mình cần biết để chọn tã phù hợp.',
    icon: <Droplet className="text-white" size={32} />
  }
];

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, signIn, setBabyProfile } = useAppContext();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<BabyProfile>>({
    skinType: 'normal',
    weight: 3.5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      if (STEPS[step].id === 'auth' && !user) {
        await signIn();
        return;
      }
      setStep(step + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!user) {
        setStep(0);
        return;
    }

    setIsSubmitting(true);
    try {
      const babyData = {
        name: formData.name || '',
        dob: formData.dob || '',
        weight: formData.weight || 3.5,
        skinType: formData.skinType || 'normal',
        userId: user.id
      };
      
      const docRef = await addDoc(collection(db, 'babyProfiles'), babyData);
      setBabyProfile({ ...babyData, id: docRef.id } as BabyProfile);
      navigate('/profile');
    } catch (error) {
      console.error('Error saving baby profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const renderStepContent = () => {
    const currentStepId = STEPS[step].id;

    switch (currentStepId) {
      case 'auth':
        return (
          <div className="space-y-6 pt-10 text-center">
             {!user ? (
                <button 
                  onClick={signIn}
                  className="w-full btn-primary !rounded-2xl !h-16 text-lg font-bold shadow-xl shadow-primary/20"
                >
                  <LogIn size={20} /> Đăng nhập bằng Google
                </button>
             ) : (
                <div className="bg-green-50 text-green-600 p-6 rounded-2xl font-bold flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Sparkles size={32} />
                    </div>
                    <div>Xin chào, {user.name}!</div>
                </div>
             )}
          </div>
        );
      case 'name':
        return (
          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Tên của bé</label>
            <input 
              type="text"
              placeholder="VD: Bé Bống, Bin..."
              className="w-full bg-gray-50 border-none rounded-2xl p-5 text-lg font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              autoFocus
            />
          </div>
        );
      case 'dob':
        return (
          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Ngày sinh của bé</label>
            <input 
              type="date"
              className="w-full bg-gray-50 border-none rounded-2xl p-5 text-lg font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              value={formData.dob || ''}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />
          </div>
        );
      case 'weight':
        return (
          <div className="space-y-8 pt-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-bold text-gray-500">Kéo để chọn cân lạng</span>
              <span className="text-2xl font-black text-primary">{formData.weight} kg</span>
            </div>
            <input 
              type="range"
              min="1"
              max="20"
              step="0.1"
              className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
            />
            <div className="grid grid-cols-5 gap-2 px-1">
              {[1, 5, 10, 15, 20].map(val => (
                <div key={val} className="text-[10px] font-bold text-gray-300 text-center">{val}kg</div>
              ))}
            </div>
          </div>
        );
      case 'skin':
        const skinTypes = [
          { value: 'normal', label: 'Da thường', desc: 'Trẻ khỏe mạnh, ít bị kích ứng' },
          { value: 'sensitive', label: 'Da nhạy cảm', desc: 'Dễ bị mẩn đỏ khi dùng tã thường' },
          { value: 'prone_to_rash', label: 'Dễ hăm tã', desc: 'Cần tã có độ thoáng khí cao' }
        ];
        return (
          <div className="space-y-3 font-sans">
            {skinTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFormData({ ...formData, skinType: type.value as any })}
                className={`w-full p-5 rounded-2xl text-left transition-all border-2 ${
                  formData.skinType === type.value 
                    ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' 
                    : 'bg-gray-50 border-transparent shadow-sm'
                }`}
              >
                <div className={`font-bold ${formData.skinType === type.value ? 'text-primary' : 'text-gray-900'}`}>
                  {type.label}
                </div>
                <div className="text-xs text-gray-400 font-medium">{type.desc}</div>
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const canNext = () => {
    const id = STEPS[step].id;
    if (id === 'auth') return !!user;
    if (id === 'name') return (formData.name?.length || 0) > 1;
    if (id === 'dob') return !!formData.dob;
    return true;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white font-sans overflow-y-auto">
      <div className="max-w-md mx-auto min-h-screen flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={handleBack}
            className={`p-3 rounded-2xl bg-gray-50 text-gray-400 transition-opacity ${step === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-8 bg-primary' : i < step ? 'w-4 bg-primary/20' : 'w-4 bg-gray-100'
                }`} 
              />
            ))}
          </div>

          <div className="w-11" /> {/* Spacer */}
        </div>

        {/* Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-xl shadow-primary/20 rotate-6">
                  {STEPS[step].icon}
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-black text-gray-900 leading-tight">
                    {STEPS[step].title}
                  </h1>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    {STEPS[step].description}
                  </p>
                </div>
              </div>

              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-10 pb-6">
          <button
            onClick={handleNext}
            disabled={!canNext() || isSubmitting}
            className={`w-full group btn-primary !h-16 !rounded-2xl text-lg font-bold shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 transition-all ${
              !canNext() ? 'opacity-50 grayscale scale-95' : 'hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {step === STEPS.length - 1 ? 'Hoàn thành ngay' : (STEPS[step].id === 'auth' && !user) ? 'Đăng nhập bằng Google' : 'Tiếp tục'}
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
