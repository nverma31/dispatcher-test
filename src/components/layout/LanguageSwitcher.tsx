import React from 'react';
import { useTranslation } from 'react-i18next';
import { SelectField, SelectOption } from '@/components/ds/select-field';

const languageOptions: SelectOption[] = [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' }
];

interface LanguageSwitcherProps {
    currentLanguage: string;
    onLanguageChange: (language: string) => void;
}

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
    const { i18n } = useTranslation();

    const handleSelectionChange = (langCode: string) => {
        if (!langCode) return;

        // Update i18next language
        i18n.changeLanguage(langCode);

        // Convert generic language code to display name for the user profile
        const displayLanguage = langCode === 'de' ? 'Deutsch' : 'English';
        onLanguageChange(displayLanguage);
    };

    // Determine the selected key based on the UserProfile display language
    // (In a real app, the profile should store 'en' or 'de', but mapping it here for the MVP)
    const selectedKey = currentLanguage === 'Deutsch' || currentLanguage === 'de' ? 'de' : 'en';

    return (
        <div style={{ width: '200px' }}>
            <SelectField
                label="Language"
                options={languageOptions}
                value={selectedKey}
                onChange={handleSelectionChange}
            />
        </div>
    );
}
