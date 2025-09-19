export function validateEmail(value: string) {
    if (!value.trim()) return "Email is required.";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) return "Enter a valid email address.";
    return "";
}

export function validatePassword(value: string) {
    if (!value.trim()) return "Password is required.";
    if (value.length < 6) return "Password must be at least 6 characters.";
    return "";
}

export function validateConfirmPassword(password: string, confirm: string) {
    if (!confirm.trim()) return "Confirm password is required.";
    if (password !== confirm) return "Passwords do not match.";
    return "";
}
