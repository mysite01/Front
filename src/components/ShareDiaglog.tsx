import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaWhatsapp, FaFacebook, FaTwitter, FaEnvelope, FaVk, FaInstagram } from "react-icons/fa";

interface Props {
    show: boolean;
    onClose: () => void;
    shareUrl: string;
}

const ShowShareDialog: React.FC<Props> = ({ show, onClose, shareUrl }) => {
    const [isCopied, setIsCopied] = useState(false);

    const socialMediaLinks = [
        { name: "WhatsApp", url: `https://wa.me/?text=${encodeURIComponent(shareUrl)}`, icon: <FaWhatsapp color="#25D366" /> },
        { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, icon: <FaFacebook color="#1877F2" /> },
        { name: "X (Twitter)", url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, icon: <FaTwitter color="#1DA1F2" /> },
        { name: "E-Mail", url: `mailto:?subject=Check this out!&body=${encodeURIComponent(shareUrl)}`, icon: <FaEnvelope color="#FFB600" /> },
        { name: "VK", url: `https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}`, icon: <FaVk color="#4680C2" /> },
        { name: "Instagram", url: "#", icon: <FaInstagram color="#E4405F" /> },
    ];

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
    };

    return (
        <Modal show={show} onHide={onClose} data-testid={"DialogShare"}>
            <Modal.Header closeButton>
                <Modal.Title>Share this Link</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                    {socialMediaLinks.map((platform) => (
                        <a
                            key={platform.name}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "16px",
                                color: "#000",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            {platform.icon}
                            {platform.name}
                        </a>
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div style={{ border: "1px solid #eae5e5", borderRadius: "10px", marginLeft: "0.5rem", padding: "0.5rem" }}>{shareUrl}
                    <Button
                        variant="primary"
                        onClick={handleCopyLink}
                        disabled={isCopied}
                        style={{ marginLeft: "0.5rem" }}
                    >
                        {isCopied ? "copy!" : "copy link"}
                    </Button>
                </div>


            </Modal.Footer>
        </Modal>
    );
};

export default ShowShareDialog;
