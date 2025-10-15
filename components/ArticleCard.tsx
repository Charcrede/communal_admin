'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Edit, Trash2 } from 'lucide-react';
import { Article, Media } from '@/lib/types';

interface ArticleCardProps {
  article: Article;
  activeMediaIndex: number;
  openMediaModal: (media: Media[]) => void;
  setActiveMediaIndex: (index: number) => void;
  handleDelete: (id: string) => void;
}

export default function ArticleCardContent({ article, activeMediaIndex, openMediaModal, setActiveMediaIndex, handleDelete }: ArticleCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    const displayContent =
        article.content.length > 200 && !isExpanded
            ? `${article.content.substring(0, 200)}...`
            : article.content;

    return (
        <Card key={article.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <Newspaper className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                                {article.title}
                            </CardTitle>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button className="p-2 text-gray-400 hover:text-[#074020] hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(article.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Rubrique: {article.rubric?.name || "Non définie"}</span>
                    <span>•</span>
                    <span>Créé le {new Date(article.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 font-semibold italic mb-2">
                    {article.head}
                </p>
                <p className="text-gray-600 leading-relaxed mb-2">
                    {displayContent}
                </p>

                {article.content.length > 200 && (
                    <button
                        onClick={toggleExpand}
                        className="text-green-600 font-medium text-sm hover:underline focus:outline-none"
                    >
                        {isExpanded ? 'Réduire' : 'Lire plus'}
                    </button>
                )}

                {article.media && article.media.length > 0 && (
                    <div
                        className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer mt-4"
                        onClick={() => openMediaModal(article.media)}
                    >
                        {article.media.map((media, index) => (
                            <div
                                key={index}
                                onClick={() => setActiveMediaIndex(index)}
                                className={`aspect-square max-w-10 max-h-10 w-auto h-auto rounded-md overflow-hidden cursor-pointer border ${activeMediaIndex === index ? 'border-green-500' : 'border-transparent'
                                    }`}
                            >
                                {media.type === 'video' ? (
                                    <video
                                        src={media.url}
                                        className="w-full h-full object-cover"
                                        muted
                                        autoPlay
                                    />
                                ) : (
                                    <img
                                        src={media.url}
                                        alt={`thumb-${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
