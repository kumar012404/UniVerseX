import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Camera, Loader2, Sparkles, Check, Info, Utensils } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ScannerPage = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [retryTimer, setRetryTimer] = useState(0);
    const fileInputRef = useRef(null);

    useEffect(() => {
        console.log('ScannerPage mounted successfully');
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const startCountdown = (seconds) => {
        setRetryTimer(seconds);
        const interval = setInterval(() => {
            setRetryTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const scanFood = async () => {
        if (!image) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('image', image);

        try {
            const res = await axios.post('/api/detect', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(res.data);
            toast.success('Food identified!');
        } catch (err) {
            const msg = err.response?.data?.message || 'Detection failed';
            toast.error(msg);
            if (msg.includes('Rate Limit')) {
                startCountdown(60);
            }
        } finally {
            setLoading(false);
        }
    };

    const addToDiet = async () => {
        if (!result) return;
        try {
            await axios.post('/api/diet', {
                foodName: result.foodName,
                calories: result.calories,
                protein: result.protein,
                carbs: result.carbs,
                fat: result.fat,
                detectedByAI: true
            });
            toast.success('Added to your diet log!');
            setResult(null);
            setPreview(null);
            setImage(null);
        } catch (err) {
            toast.error('Failed to add to diet log');
        }
    };

    return (
        <div style={{ padding: '100px 20px', minHeight: '100vh', color: 'white' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold' }}>AI Food Scanner</h1>
                <p style={{ color: '#94A3B8' }}>Upload a photo to see nutrition info.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>
                <div>
                    <div
                        onClick={() => fileInputRef.current.click()}
                        style={{
                            aspectRatio: '1/1',
                            border: '2px dashed rgba(255,255,255,0.1)',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            background: 'rgba(255,255,255,0.05)'
                        }}
                    >
                        {preview ? (
                            <img src={preview} style={{ width: '100%', height: '100%', objectCover: 'cover' }} alt="Preview" />
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <Camera size={48} style={{ color: '#8B5CF6', marginBottom: '10px' }} />
                                <p>Click to Upload Image</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                    </div>

                    <button
                        onClick={scanFood}
                        disabled={!image || loading || retryTimer > 0}
                        style={{
                            width: '100%',
                            marginTop: '20px',
                            padding: '15px',
                            borderRadius: '12px',
                            background: '#8B5CF6',
                            color: 'white',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer',
                            opacity: (!image || loading || retryTimer > 0) ? 0.5 : 1
                        }}
                    >
                        {loading ? 'Analyzing...' : (retryTimer > 0 ? `Retry in ${retryTimer}s` : 'Analyze Food')}
                    </button>
                    {retryTimer > 0 && <p style={{ color: '#f87171', fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>Rate limit hit. Please wait.</p>}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {result ? (
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{result.foodName}</h2>
                            <p style={{ fontStyle: 'italic', color: '#94A3B8', margin: '10px 0' }}>{result.description}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
                                    <p style={{ fontSize: '10px', color: '#94A3B8' }}>CALORIES</p>
                                    <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{result.calories}</p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
                                    <p style={{ fontSize: '10px', color: '#94A3B8' }}>PROTEIN</p>
                                    <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{result.protein}g</p>
                                </div>
                            </div>
                            <button
                                onClick={addToDiet}
                                style={{
                                    width: '100%',
                                    marginTop: '20px',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    background: '#10B981',
                                    color: 'white',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                <Check size={18} /> Add to Log
                            </button>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#475569', marginTop: '50px' }}>
                            <Info size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                            <p>Results will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScannerPage;
