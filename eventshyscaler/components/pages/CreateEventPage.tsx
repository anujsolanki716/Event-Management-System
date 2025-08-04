import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { generateEventDescription } from '../../services/api';
import Spinner from '../common/Spinner';
import toast from 'react-hot-toast';

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { addEvent, currentUser } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('0');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<'url' | 'upload'>('url');





  if (!currentUser) {
    return (
      <div className="text-center py-16 bg-slate-800 rounded-lg">
        <h2 className="text-2xl font-semibold text-slate-300">Access Denied</h2>
        <p className="text-slate-500 mt-2">
            Please <Link to="/login" className="text-sky-400 hover:underline font-medium">log in</Link> to create an event.
        </p>
      </div>
    );
  }

  const handleGenerateDesc = async () => {
    if (!title) {
        toast.error("Please enter a title first to generate a description.");
        return;
    }
    setIsGenerating(true);
    try {
        const { data } = await generateEventDescription(title, location);
        setDescription(data.description);
    } catch (err) {
        toast.error("Failed to generate description.");
    } finally {
        setIsGenerating(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !location) {
        toast.error("Please fill in all required fields.");
        return;
    }

    let finalImageUrl = '';

    if (imageSource === 'upload' && uploadedImage) {
      finalImageUrl = imagePreview || '';
    } else if (imageSource === 'url' && imageUrl.trim() !== '') {
      finalImageUrl = imageUrl.trim();
    } else {
      finalImageUrl = `https://picsum.photos/seed/${title.replace(/\s/g, '-')}/1200/600`;
    }


    const newEvent = await addEvent({
      title,
      description,
      date,
      time,
      location,
      imageUrl: finalImageUrl,
      tickets: [{ type: 'General', price: parseFloat(price) }]
    });
    if (newEvent) {
      navigate(`/event/${newEvent._id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-slate-800 p-8 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-white mb-6">Create a New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Image Source</label>
          <div className="flex gap-6 text-slate-300">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="imageSource"
                value="url"
                checked={imageSource === 'url'}
                onChange={() => setImageSource('url')}
                className="accent-sky-500"
              />
              Use Image URL
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="imageSource"
                value="upload"
                checked={imageSource === 'upload'}
                onChange={() => setImageSource('upload')}
                className="accent-sky-500"
              />
              Upload Image
            </label>
          </div>
        </div>
        {imageSource === 'url' ? (
          <div className="mt-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-300">Image URL</label>
            <input
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        ) : (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUploadedImage(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className="mt-1 block w-full text-slate-300 bg-slate-700 border-slate-600 rounded-md py-2 px-3"
            />
          </div>
        )}


        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300">Event Title</label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500" required />
        </div>

        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300">Description</label>
          <div className="relative">
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500" />
            <button type="button" onClick={handleGenerateDesc} disabled={isGenerating} className="absolute bottom-3 right-3 bg-indigo-500 text-white px-3 py-1 text-xs rounded-md hover:bg-indigo-600 disabled:bg-slate-500">
              {isGenerating ? <Spinner /> : 'Generate with AI'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-300">Date</label>
                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500" required />
            </div>
            <div>
                <label htmlFor="time" className="block text-sm font-medium text-slate-300">Time</label>
                <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500" required />
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-300">Location</label>
            <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., 'City Conference Center' or 'Virtual'" required />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-slate-300">Ticket Price (Rs)</label>
            <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} min="0" className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500" />
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <button type="button" onClick={() => navigate('/')} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-md mr-4 hover:bg-slate-700">Cancel</button>
          <button type="submit" className="bg-sky-500 text-white font-bold py-2 px-4 rounded-md hover:bg-sky-600">Create Event</button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;
