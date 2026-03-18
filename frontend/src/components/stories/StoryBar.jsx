import { useState, useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import StoryViewer from './StoryViewer'

export default function StoryBar() {
    const { user } = useAuth()
    const [viewingUserIdx, setViewingUserIdx] = useState(null)
    const fileInputRef = useRef(null)
    const queryClient = useQueryClient()

    const { data: storyData = [] } = useQuery('stories', async () => {
        const res = await api.get('/stories')
        return res.users || []
    })

    // Real file upload mechanism
    const addStoryMutation = useMutation(async (mediaUrl) => {
        const res = await api.post('/stories', { mediaUrl })
        return res
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('stories')
        }
    })

    const handleFileSelect = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const toastId = toast.loading('Uploading story...')
        try {
            const formData = new FormData()
            formData.append('story', file)

            const uploadRes = await api.post('/upload/story', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            if (uploadRes.success) {
                await addStoryMutation.mutateAsync(uploadRes.mediaUrl)
                toast.success('Story added!', { id: toastId })
            }
        } catch (error) {
            toast.error(error.message || 'Failed to upload story', { id: toastId })
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    return (
        <div className="w-full mb-6">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-2">
                {/* Add Story Button */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0 snap-start">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*,video/*"
                        className="hidden"
                    />
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-16 h-16 rounded-full glass-panel flex items-center justify-center border-2 border-dashed border-primary-500 cursor-pointer relative group overflow-hidden"
                    >
                        {user?.profile?.avatar ? (
                            <img src={user.profile.avatar} className="w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-30" />
                        ) : null}
                        <Plus size={24} className="text-primary-400 absolute z-10 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-xs text-gray-400 font-medium">Add Story</span>
                </div>

                {/* Stories */}
                {storyData.map((userStoryGroup, idx) => (
                    <div
                        key={userStoryGroup.author.id}
                        className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer snap-start group"
                        onClick={() => setViewingUserIdx(idx)}
                    >
                        <div className="w-16 h-16/ rounded-full p-[2px] bg-gradient-to-tr from-primary-500 to-purple-500 group-hover:scale-105 transition-transform">
                            <div className="w-full h-full rounded-full border-2 border-gray-900 overflow-hidden">
                                <img
                                    src={userStoryGroup.author.avatar || `https://ui-avatars.com/api/?name=${userStoryGroup.author.username}&background=random`}
                                    alt={userStoryGroup.author.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <span className="text-xs text-gray-300 font-medium truncate w-16 text-center">
                            {userStoryGroup.author.id === user?.id ? 'Your Story' : userStoryGroup.author.username}
                        </span>
                    </div>
                ))}
            </div>

            {/* Story Viewer Modal */}
            {viewingUserIdx !== null && (
                <StoryViewer
                    stories={storyData[viewingUserIdx].stories.map(s => ({ ...s, author: storyData[viewingUserIdx].author }))}
                    onClose={() => setViewingUserIdx(null)}
                />
            )}
        </div>
    )
}
