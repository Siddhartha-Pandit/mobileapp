export interface PasswordRules {
  length: boolean;
  complexity: boolean;
  nameCheck: boolean;
}

export const getPasswordRulesStatus = (password: string, fullName?: string): PasswordRules => {
  const length = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const complexity = hasLetter && hasNumber;
  
  let nameCheck = true;
  if (fullName) {
    const nameParts = fullName.toLowerCase().split(' ').filter(p => p.length > 2);
    for (const part of nameParts) {
      if (password.toLowerCase().includes(part)) {
        nameCheck = false;
        break;
      }
    }
  }

  return { length, complexity, nameCheck };
};

export const validatePassword = (password: string, fullName?: string): { isValid: boolean; message: string } => {
  const rules = getPasswordRulesStatus(password, fullName);

  if (!rules.length) {
    return { isValid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!rules.complexity) {
    return { isValid: false, message: 'Password must include both letters and numbers.' };
  }
  if (!rules.nameCheck) {
    return { isValid: false, message: 'Password should not contain your name.' };
  }

  return { isValid: true, message: '' };
};
