import React from "react";
import { Pen, Plus, LogOut } from "lucide-react";
import { experimental } from "@freenow/wave";
import { UserProfile } from "@/types";

const { Button: WaveButton } = experimental;

interface AccountScreenProps {
    user: UserProfile;
    onUpdateUser: (updatedUser: Partial<UserProfile>) => void;
    onSignOut: () => void;
}

export function AccountScreen({ user, onUpdateUser, onSignOut }: AccountScreenProps) {
    const profileFields = [
        { label: "First Name", value: user.firstName, key: "firstName" },
        { label: "Last Name", value: user.lastName, key: "lastName" },
        { label: "Email", value: user.email, key: "email" },
        { label: "Phone number", value: user.phone, key: "phone" },
        { label: "Language", value: user.language, key: "language" },
    ];

    return (
        // Full page — matches app background
        <div
            style={{
                minHeight: "100%",
                backgroundColor: "var(--color-sys-background)",
                padding: "32px",
            }}
        >
            {/* Card */}
            <div
                style={{
                    backgroundColor: "var(--color-sys-surface)",
                    borderRadius: "var(--radius-lg)",
                    maxWidth: "660px",
                    padding: "32px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                }}
            >
                {/* Header row */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "24px",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "var(--fs-title-1)",
                            fontWeight: "var(--fw-title-1)",
                            lineHeight: "var(--lh-title-1)",
                            color: "var(--color-sys-on-surface)",
                            margin: 0,
                        }}
                    >
                        Profile details
                    </h1>

                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        {/* Add new number — secondary emphasis (surface-variant bg, on-surface text) */}
                        <WaveButton emphasis="secondary">
                            <Plus size={16} style={{ marginRight: 6 }} />
                            Add new number
                        </WaveButton>

                        {/* Sign out — styled with marooned tint to match design */}
                        <WaveButton
                            emphasis="secondary"
                            onPress={onSignOut}
                            style={{
                                backgroundColor: "var(--color-sys-tier-standard-container)",
                                color: "var(--color-sys-on-tier-standard-container)",
                            }}
                        >
                            <LogOut size={16} style={{ marginRight: 6 }} />
                            Sign out
                        </WaveButton>
                    </div>
                </div>

                {/* Field rows */}
                <div>
                    {profileFields.map((field, index) => (
                        <div
                            key={field.key}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                borderTop: index === 0 ? "none" : `1px solid var(--color-sys-divider)`,
                                paddingTop: index === 0 ? 0 : "20px",
                                paddingBottom: "20px",
                            }}
                        >
                            {/* Label */}
                            <span
                                style={{
                                    width: "160px",
                                    flexShrink: 0,
                                    fontSize: "var(--fs-body-1)",
                                    fontWeight: "var(--fw-body-1)",
                                    color: "var(--color-sys-on-surface)",
                                }}
                            >
                                {field.label}
                            </span>

                            {/* Value */}
                            <span
                                style={{
                                    flex: 1,
                                    fontSize: "var(--fs-body-1)",
                                    color: "var(--color-sys-on-surface)",
                                }}
                            >
                                {field.value}
                            </span>

                            {/* Edit icon button */}
                            <button
                                aria-label={`Edit ${field.label}`}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "6px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "var(--color-sys-on-surface-variant)",
                                    flexShrink: 0,
                                }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-sys-surface-container)")}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                            >
                                <Pen size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
