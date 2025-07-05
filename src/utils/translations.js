import { useLanguageStore } from '../store/languageStore';

export const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    growthPlan: 'Growth Plan',
    leave: 'Leave',
    skills: 'Skills',
    payslips: 'Payslips',
    profile: 'Profile',
    settings: 'Settings',
    admin: 'Admin',
    logout: 'Logout',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    submit: 'Submit',
    loading: 'Loading...',
    search: 'Search',
    filter: 'Filter',
    
    // Dashboard
    welcome: 'Welcome back',
    nextActions: 'Next Actions',
    kpiProgress: 'KPI Progress',
    recentActivity: 'Recent Activity',
    teamOverview: 'Team Overview',
    
    // Growth Plan
    tasks: 'Tasks',
    todo: 'To Do',
    inProgress: 'In Progress',
    done: 'Done',
    dueDate: 'Due Date',
    assignedTo: 'Assigned To',
    
    // Leave
    leaveBalance: 'Leave Balance',
    requestLeave: 'Request Leave',
    leaveHistory: 'Leave History',
    approved: 'Approved',
    pending: 'Pending',
    rejected: 'Rejected',
    
    // Skills
    skillsMatrix: 'Skills Matrix',
    addSkill: 'Add Skill',
    proficiency: 'Proficiency',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
    
    // Messages
    loginSuccess: 'Login successful!',
    loginError: 'Login failed. Please try again.',
    saveSuccess: 'Changes saved successfully!',
    deleteSuccess: 'Item deleted successfully!',
    pointsEarned: 'Points Earned',
    levelUp: 'Level Up!',
    
    // Kuwaiti slang
    allSet: 'All set, yalla!',
    greatJob: 'Great job, mashallah!',
    almostThere: 'Almost there, khalas!',
  },
  ar: {
    // Navigation
    dashboard: 'لوحة التحكم',
    growthPlan: 'خطة النمو',
    leave: 'الإجازات',
    skills: 'المهارات',
    payslips: 'كشوف الراتب',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    admin: 'الإدارة',
    logout: 'تسجيل الخروج',
    
    // Common
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    add: 'إضافة',
    submit: 'إرسال',
    loading: 'جاري التحميل...',
    search: 'بحث',
    filter: 'تصفية',
    
    // Dashboard
    welcome: 'مرحباً بعودتك',
    nextActions: 'الإجراءات التالية',
    kpiProgress: 'تقدم مؤشرات الأداء',
    recentActivity: 'النشاط الأخير',
    teamOverview: 'نظرة عامة على الفريق',
    
    // Growth Plan
    tasks: 'المهام',
    todo: 'للقيام به',
    inProgress: 'قيد التنفيذ',
    done: 'مكتمل',
    dueDate: 'تاريخ الاستحقاق',
    assignedTo: 'مُكلف إلى',
    
    // Leave
    leaveBalance: 'رصيد الإجازات',
    requestLeave: 'طلب إجازة',
    leaveHistory: 'تاريخ الإجازات',
    approved: 'موافق عليه',
    pending: 'قيد الانتظار',
    rejected: 'مرفوض',
    
    // Skills
    skillsMatrix: 'مصفوفة المهارات',
    addSkill: 'إضافة مهارة',
    proficiency: 'مستوى الإتقان',
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'متقدم',
    expert: 'خبير',
    
    // Messages
    loginSuccess: 'تم تسجيل الدخول بنجاح!',
    loginError: 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.',
    saveSuccess: 'تم حفظ التغييرات بنجاح!',
    deleteSuccess: 'تم حذف العنصر بنجاح!',
    pointsEarned: 'النقاط المكتسبة',
    levelUp: 'لقد ارتقيت!',
    
    // Kuwaiti slang
    allSet: 'خلاص، يالله!',
    greatJob: 'شغل ممتاز، ماشاء الله!',
    almostThere: 'تقريباً وصلنا، خلاص!',
  }
};

export const useTranslation = () => {
  const { language } = useLanguageStore();
  
  const t = (key) => {
    return translations[language][key] || key;
  };
  
  return { t, language };
};