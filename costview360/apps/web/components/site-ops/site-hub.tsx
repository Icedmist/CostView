"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  Send,
  MessageSquare,
  ThumbsUp,
  Image as ImageIcon,
  DollarSign,
  AlertTriangle,
  HardHat,
  Users,
  Sun,
  CloudRain,
  Tag,
  Paperclip,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronDown,
  Trash2,
  UploadCloud,
  X,
  Loader2,
} from "lucide-react";
import { uploadToStorage } from "@/lib/storage/client";

export interface TaggedUser {
  id: string;
  name: string;
  role: string;
}

export interface PostComment {
  id: string;
  postId: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

export interface SitePost {
  id: string;
  projectId: string;
  authorName: string;
  authorRole: string;
  content: string;
  postType: "progress" | "expense" | "log" | "issue";
  amountSpent: number;
  expenseCategory?: string;
  taggedUsers: TaggedUser[];
  mediaUrls: string[];
  metadata: {
    weather?: string;
    headcount?: number;
    delayHours?: number;
  };
  likesCount: number;
  userLiked?: boolean;
  comments: PostComment[];
  createdAt: string;
}

export function SiteHub() {
  const { currentProject, currency, activeRole, availableProjects } = useApp();
  const [projectMembers, setProjectMembers] = useState<TaggedUser[]>([]);
  const [posts, setPosts] = useState<SitePost[]>([]);
  const [filterType, setFilterType] = useState<"all" | "progress" | "expense" | "issue">("all");
  const [activeTab, setActiveTab] = useState<"feed" | "photos">("feed");

  // Composer Form States
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<"progress" | "expense" | "log" | "issue">("progress");
  const [amountSpent, setAmountSpent] = useState<number | "">("");
  const [expenseCategory, setExpenseCategory] = useState("Materials");
  const [weather, setWeather] = useState("Sunny");
  const [headcount, setHeadcount] = useState<number>(45);
  const [selectedTags, setSelectedTags] = useState<TaggedUser[]>([]);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;
    setIsUploadingPhoto(true);
    setUploadError(null);
    try {
      const uploadPromises = selectedFiles.map((file) => uploadToStorage(file, "pictures"));
      const results = await Promise.all(uploadPromises);
      const newUrls: string[] = [];
      let firstError: string | null = null;
      for (const res of results) {
        if (res.error) {
          firstError = res.error;
        } else if (res.url) {
          newUrls.push(res.url);
        }
      }
      if (newUrls.length > 0) {
        setUploadedPhotos((prev) => [...prev, ...newUrls]);
      }
      if (firstError && newUrls.length === 0) {
        setUploadError(firstError);
      }
    } catch (err: any) {
      setUploadError(err?.message || "Failed to upload photos to storage.");
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = "";
    }
  };

  // Active Comment Input States
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  // Fetch real posts from Supabase on mount & when project changes
  useEffect(() => {
    let isMounted = true;
    async function fetchPosts() {
      try {
        const supabase = createClient();
        let query = supabase
          .from("site_posts")
          .select("*, site_post_comments(*)")
          .order("created_at", { ascending: false });

        if (currentProject?.id) {
          query = query.eq("project_id", currentProject.id);
        }

        const { data: postsData, error } = await query;

        if (!error && postsData && postsData.length > 0) {
          const mapped: SitePost[] = postsData.map((p: any) => ({
            id: p.id,
            projectId: p.project_id,
            authorName: p.author_name || "Team Member",
            authorRole: p.author_role || "Site Engineer",
            content: p.content,
            postType: p.post_type || "progress",
            amountSpent: Number(p.amount_spent || 0),
            expenseCategory: p.expense_category || undefined,
            taggedUsers: Array.isArray(p.tagged_users) ? p.tagged_users : [],
            mediaUrls: Array.isArray(p.media_urls) ? p.media_urls : [],
            metadata: p.metadata || {},
            likesCount: Number(p.likes_count || 0),
            comments: Array.isArray(p.site_post_comments)
              ? p.site_post_comments.map((c: any) => ({
                  id: c.id,
                  postId: c.post_id,
                  authorName: c.author_name,
                  authorRole: c.author_role,
                  content: c.content,
                  createdAt: c.created_at,
                }))
              : [],
            createdAt: p.created_at,
          }));
          if (isMounted) setPosts(mapped);
        } else if (isMounted) {
          setPosts([]);
        }

        // Fetch explicitly the team members assigned to this specific project
        if (currentProject?.id) {
          const { data: memberRows } = await supabase
            .from("project_members")
            .select("user_id, role")
            .eq("project_id", currentProject.id);

          if (isMounted) {
            if (memberRows && memberRows.length > 0) {
              const userIds = memberRows.map((m: any) => m.user_id);
              const { data: profilesData } = await supabase
                .from("profiles")
                .select("id, full_name, default_role")
                .in("id", userIds);

              const profileMap = new Map((profilesData || []).map((p: any) => [p.id, p]));
              const projectSpecificMembers = memberRows.map((m: any) => {
                const prof = profileMap.get(m.user_id);
                return {
                  id: m.user_id,
                  name: prof?.full_name || "Project Member",
                  role: m.role || prof?.default_role || "Staff",
                };
              });
              setProjectMembers(projectSpecificMembers);
            } else {
              setProjectMembers([]);
            }
          }
        }
      } catch (err) {
        console.warn("Using local state for Site Hub", err);
      }
    }
    fetchPosts();
    return () => {
      isMounted = false;
    };
  }, [currentProject?.id]);

  // Handle Post Creation
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    let targetProjectId = currentProject?.id;
    if (!targetProjectId) {
      if (availableProjects && availableProjects.length > 0 && availableProjects[0].id) {
        targetProjectId = availableProjects[0].id;
      } else {
        const supabase = createClient();
        const { data: proj } = await supabase.from("projects").select("id").limit(1).maybeSingle();
        if (proj?.id) {
          targetProjectId = proj.id;
        }
      }
    }

    if (!targetProjectId) {
      alert("No active project found. Please select or create a project first.");
      return;
    }

    setIsSubmitting(true);
    const postPayload = {
      content: content.trim(),
      postType,
      amountSpent: Number(amountSpent) || 0,
      expenseCategory: postType === "expense" ? expenseCategory : undefined,
      taggedUsers: selectedTags,
      mediaUrls: [...uploadedPhotos],
      metadata: {
        weather,
        headcount: Number(headcount) || 0,
      },
    };

    // Reset composer form immediately
    setContent("");
    setAmountSpent("");
    setSelectedTags([]);
    setUploadedPhotos([]);
    setShowPhotoInput(false);
    setShowTagPicker(false);

    try {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;

      const authorName =
        currentUser?.user_metadata?.full_name ||
        currentUser?.email?.split("@")[0] ||
        activeRole;

      const { data: createdPost, error } = await supabase
        .from("site_posts")
        .insert({
          project_id: targetProjectId,
          author_id: currentUser?.id || null,
          author_name: authorName,
          author_role: activeRole,
          content: postPayload.content,
          post_type: postPayload.postType,
          amount_spent: postPayload.amountSpent,
          expense_category: postPayload.expenseCategory,
          tagged_users: postPayload.taggedUsers,
          media_urls: postPayload.mediaUrls,
          metadata: postPayload.metadata,
          likes_count: 0,
        })
        .select("*, site_post_comments(*)")
        .single();

      if (!error && createdPost) {
        const newPost: SitePost = {
          id: createdPost.id,
          projectId: createdPost.project_id,
          authorName: createdPost.author_name,
          authorRole: createdPost.author_role,
          content: createdPost.content,
          postType: createdPost.post_type,
          amountSpent: Number(createdPost.amount_spent || 0),
          expenseCategory: createdPost.expense_category,
          taggedUsers: Array.isArray(createdPost.tagged_users) ? createdPost.tagged_users : [],
          mediaUrls: Array.isArray(createdPost.media_urls) ? createdPost.media_urls : [],
          metadata: createdPost.metadata || {},
          likesCount: 0,
          userLiked: false,
          comments: [],
          createdAt: createdPost.created_at,
        };
        setPosts((prev) => [newPost, ...prev]);
      } else {
        console.error("Failed to insert site post:", error);
      }
    } catch (err) {
      console.error("Error creating site post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Like / Acknowledge
  const handleToggleLike = async (postId: string) => {
    let targetLikes = 0;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const userLiked = !p.userLiked;
          targetLikes = userLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1);
          return { ...p, userLiked, likesCount: targetLikes };
        }
        return p;
      })
    );

    try {
      const supabase = createClient();
      await supabase
        .from("site_posts")
        .update({ likes_count: targetLikes })
        .eq("id", postId);
    } catch (err) {
      console.warn("Could not persist like count", err);
    }
  };

  // Add Comment to Post
  const handleAddComment = async (postId: string) => {
    if (!commentText.trim()) return;
    const text = commentText.trim();
    setCommentText("");

    try {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;
      const authorName =
        currentUser?.user_metadata?.full_name ||
        currentUser?.email?.split("@")[0] ||
        activeRole;

      const { data: newComm, error } = await supabase
        .from("site_post_comments")
        .insert({
          post_id: postId,
          author_id: currentUser?.id || null,
          author_name: authorName,
          author_role: activeRole,
          content: text,
        })
        .select()
        .single();

      if (!error && newComm) {
        const commentItem: PostComment = {
          id: newComm.id,
          postId: newComm.post_id,
          authorName: newComm.author_name,
          authorRole: newComm.author_role,
          content: newComm.content,
          createdAt: newComm.created_at,
        };
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              return { ...p, comments: [...p.comments, commentItem] };
            }
            return p;
          })
        );
      } else {
        console.error("Failed to add comment:", error);
      }
    } catch (err) {
      console.error("Error creating comment:", err);
    }
  };

  // Toggle tag in composer
  const handleToggleTag = (member: TaggedUser) => {
    setSelectedTags((prev) => {
      const exists = prev.some((t) => t.id === member.id);
      if (exists) {
        return prev.filter((t) => t.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  };

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    if (filterType === "all") return true;
    if (filterType === "progress") return p.postType === "progress" || p.postType === "log";
    if (filterType === "expense") return p.postType === "expense";
    if (filterType === "issue") return p.postType === "issue";
    return true;
  });

  // Calculate total spent from posts
  const totalSpentInHub = posts.reduce((sum, p) => sum + (p.amountSpent || 0), 0);
  const allPhotos = posts.flatMap((p) => p.mediaUrls);

  return (
    <div className="space-y-6">
      {/* Top Hub Bar: Clean, Minimalist Title */}
      <div className="bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-[#FFD23F] text-[#0A1931]">
              PROJECT HUB
            </span>
            <span className="text-sm font-bold text-[#0A2540]/70 dark:text-slate-300">
              {currentProject.name}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#0A2540] dark:text-white tracking-tight">
            Site Progress &amp; Activity Hub
          </h1>
          <p className="text-sm text-[#0A2540]/80 dark:text-slate-300 mt-1">
            Real-time field updates, daily logs, expenditure tracking, and team collaboration.
          </p>
        </div>

        {/* Quick Hub Stats */}
        <div className="flex items-center gap-4 text-xs font-black">
          <div className="px-4 py-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F]">
            <span className="text-[#0A2540]/60 dark:text-slate-400 block text-xs uppercase font-extrabold">Logged Spent</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold text-base">
              {formatCurrency(totalSpentInHub, currency)}
            </span>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F]">
            <span className="text-[#0A2540]/60 dark:text-slate-400 block text-xs uppercase font-extrabold">Updates</span>
            <span className="font-mono text-[#0A2540] dark:text-white font-extrabold text-base">
              {posts.length} Posts
            </span>
          </div>
        </div>
      </div>

      {/* Unified Social Stream: Social Post Composer and Feed combined as a single continuous timeline */}
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Social Composer Card */}
        <div className="bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DE] dark:border-[#1E3A5F]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#0A2540] text-white flex items-center justify-center font-black text-xs">
                {activeRole.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#0A2540] dark:text-white flex items-center gap-1.5">
                  <HardHat className="w-3.5 h-3.5 text-[#FFD23F]" />
                  Create Site Update
                </span>
                <span className="text-[11px] font-semibold text-[#0A2540]/60 dark:text-slate-400 block">
                  Posting as <strong>{activeRole}</strong>
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#FFD23F] text-[#0A1931]">
              Social Feed
            </span>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-4">
            {/* Post Type Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "progress", label: "🏗️ Progress", desc: "Work completed" },
                { id: "expense", label: "💰 Spent Cost", desc: "Materials / Labour" },
                { id: "issue", label: "⚠️ Site Alert", desc: "Blocker / Safety" },
                { id: "log", label: "📋 Daily Log", desc: "Shift summary" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPostType(t.id as any)}
                  className={`p-2.5 rounded-xl text-xs font-black border text-left transition-all cursor-pointer ${
                    postType === t.id
                      ? "bg-[#0A2540] text-white border-[#0A2540] shadow-xs dark:bg-[#FFD23F] dark:text-[#0A1931] dark:border-[#FFD23F]"
                      : "bg-[#FAF9F5] dark:bg-[#071324] text-[#0A2540] dark:text-white border-[#E5E5DE] dark:border-[#1E3A5F] hover:bg-slate-100"
                  }`}
                >
                  <div className="text-xs sm:text-sm font-black">{t.label}</div>
                  <div className={`text-[10px] sm:text-xs font-medium mt-0.5 truncate ${postType === t.id ? "opacity-90" : "text-[#0A2540]/70 dark:text-slate-400"}`}>
                    {t.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* If Expense: Show Amount and Category */}
            {postType === "expense" && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 space-y-2.5">
                <div className="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" /> What Was Spent
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1">
                      Amount Spent ({currency})
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 450000"
                      value={amountSpent}
                      onChange={(e) => setAmountSpent(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-[#071324] border border-amber-300 dark:border-amber-700 rounded-lg text-sm font-mono font-black text-[#0A2540] dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1">
                      Expense Category
                    </label>
                    <select
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#071324] border border-amber-300 dark:border-amber-700 rounded-lg text-xs font-black text-[#0A2540] dark:text-white focus:outline-none"
                    >
                      <option value="Materials">Materials &amp; Supplies</option>
                      <option value="Labour">Direct Labour &amp; Daily Pay</option>
                      <option value="Plant">Plant, Fuel &amp; Equipment</option>
                      <option value="Petty Cash">Site Petty Cash / Sundries</option>
                      <option value="Transport">Haulage &amp; Logistics</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Textarea for Update Content */}
            <div>
              <textarea
                rows={3}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What happened on site? Describe progress, log what was spent, or tag teammates..."
                className="w-full p-3.5 bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-xl text-xs sm:text-sm font-semibold text-[#0A2540] dark:text-white placeholder-[#0A2540]/40 focus:outline-none focus:border-[#0A2540] transition-all resize-none"
              />
            </div>

            {/* Tagged members preview chips */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedTags.map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-lg text-xs font-black text-amber-950 dark:text-amber-200"
                  >
                    @{t.name}
                    <button
                      type="button"
                      onClick={() => handleToggleTag(t)}
                      className="hover:text-rose-600 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag picker list */}
            {showTagPicker && (
              <div className="p-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] space-y-1 max-h-36 overflow-y-auto">
                {projectMembers.length === 0 ? (
                  <div className="p-2 text-xs text-slate-500 italic text-center">
                    No team members registered yet
                  </div>
                ) : (
                  projectMembers.map((m) => {
                    const isTagged = selectedTags.some((t) => t.id === m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleToggleTag(m)}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-bold flex items-center justify-between transition-all ${
                          isTagged
                            ? "bg-[#0A2540] text-white"
                            : "hover:bg-slate-200/70 text-[#0A2540] dark:text-slate-200"
                        }`}
                      >
                        <span>{m.name}</span>
                        <span className={`text-[10px] ${isTagged ? "text-white/80" : "text-[#0A2540]/60 dark:text-slate-400"}`}>
                          {m.role}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {/* Photo Attachment Storage Upload (Multi-Item, No Raw URLs) */}
            {showPhotoInput && (
              <div className="p-3 bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#0A2540] dark:text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span>Attach Site Photos {uploadedPhotos.length > 0 ? `(${uploadedPhotos.length})` : ""}</span>
                  </span>
                  {uploadedPhotos.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setUploadedPhotos([])}
                      className="text-rose-600 hover:underline flex items-center gap-0.5 text-[10px] cursor-pointer"
                    >
                      <X className="w-3 h-3" /> Clear all
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-[#0A2540] hover:bg-[#0A2540]/90 text-white dark:bg-amber-400 dark:text-[#0A1931] rounded-lg text-xs font-bold cursor-pointer transition-all">
                    {isUploadingPhoto ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3.5 h-3.5" /> Upload Photos from Device / Camera
                      </>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={isUploadingPhoto}
                      onChange={handlePhotoFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-[#0A2540]/60 dark:text-slate-400">
                    Supports selecting multiple images
                  </span>
                </div>

                {uploadError && (
                  <p className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 p-2 rounded border border-rose-200">
                    {uploadError}
                  </p>
                )}

                {/* Uploaded Photos Grid Preview */}
                {uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-1">
                    {uploadedPhotos.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-[#E5E5DE] dark:border-white/10 group bg-slate-100 dark:bg-slate-800"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Uploaded capture ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setUploadedPhotos((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/75 hover:bg-rose-600 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Social Action Toolbar */}
            <div className="pt-2 border-t border-[#E5E5DE] dark:border-[#1E3A5F] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Photo Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPhotoInput(!showPhotoInput)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    showPhotoInput || uploadedPhotos.length > 0
                      ? "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-200"
                      : "bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white hover:bg-slate-100"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Photos {uploadedPhotos.length > 0 ? `(${uploadedPhotos.length})` : ""}</span>
                </button>

                {/* Tag Teammates Toggle */}
                <button
                  type="button"
                  onClick={() => setShowTagPicker(!showTagPicker)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    showTagPicker || selectedTags.length > 0
                      ? "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-200"
                      : "bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white hover:bg-slate-100"
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Tag {selectedTags.length > 0 ? `(${selectedTags.length})` : "@"}</span>
                </button>

                {/* Weather Pill */}
                <div className="flex items-center gap-1 bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#0A2540] dark:text-white">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <select
                    value={weather}
                    onChange={(e) => setWeather(e.target.value)}
                    className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="Sunny">Sunny</option>
                    <option value="Rainy">Rainy</option>
                    <option value="Overcast">Overcast</option>
                  </select>
                </div>

                {/* Crew Count Pill */}
                <div className="flex items-center gap-1 bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#0A2540] dark:text-white">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <input
                    type="number"
                    value={headcount}
                    onChange={(e) => setHeadcount(Number(e.target.value))}
                    className="w-10 bg-transparent text-xs font-mono font-bold focus:outline-none"
                    title="Workers on site"
                  />
                  <span className="text-[10px] text-slate-500">crew</span>
                </div>
              </div>

              {/* Submit Post Button */}
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="min-h-[40px] px-6 bg-[#0A2540] hover:bg-[#003366] dark:bg-[#FFD23F] dark:hover:bg-[#FFD23F]/90 text-white dark:text-[#0A1931] rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ml-auto"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Update</span>
              </button>
            </div>
          </form>
        </div>

        {/* Feed Filter Bar */}
        <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-2xl p-3 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: "all", label: `All Updates (${posts.length})` },
              { id: "progress", label: "🏗️ Progress" },
              { id: "expense", label: "💰 Expenses" },
              { id: "issue", label: "⚠️ Alerts" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  filterType === tab.id
                    ? "bg-[#0A2540] text-white shadow-xs dark:bg-[#FFD23F] dark:text-[#0A1931]"
                    : "text-[#0A2540]/70 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#071324]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setActiveTab("feed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black ${
                activeTab === "feed"
                  ? "bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white"
                  : "text-[#0A2540]/60 dark:text-slate-400"
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab("photos")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black ${
                activeTab === "photos"
                  ? "bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white"
                  : "text-[#0A2540]/60 dark:text-slate-400"
              }`}
            >
              Photos ({allPhotos.length})
            </button>
          </div>
        </div>

          {/* Photos Tab View */}
          {activeTab === "photos" && (
            <div className="bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-2xl p-6 shadow-xs">
              {allPhotos.length === 0 ? (
                <div className="py-12 text-center text-[#0A2540]/60 dark:text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto opacity-40 mb-2" />
                  <p className="font-bold text-sm text-[#0A2540] dark:text-white">No site photos uploaded yet</p>
                  <p className="text-xs mt-1">Attach photo URLs in your site updates to build the project gallery.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {allPhotos.map((url, idx) => (
                    <div
                      key={idx}
                      className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-[#E5E5DE] relative group"
                    >
                      <img
                        src={url}
                        alt={`Site capture ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          (e.target as any).src = "https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?w=500&auto=format&fit=crop";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Social Feed Tab View */}
          {activeTab === "feed" && (
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-2xl p-12 text-center shadow-xs">
                  <HardHat className="w-10 h-10 mx-auto text-[#0A2540]/30 dark:text-slate-500 mb-3" />
                  <p className="font-black text-base text-[#0A2540] dark:text-white">No Site Updates In This Feed Yet</p>
                  <p className="text-xs text-[#0A2540]/60 dark:text-slate-400 max-w-sm mx-auto mt-1">
                    Be the first to share today&apos;s site progress, log an expense incurred on site, or tag colleagues for inspection.
                  </p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-[#0A1931] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] rounded-2xl p-5 shadow-xs space-y-3.5 transition-all"
                  >
                    {/* Post Header: Author, Badge, Timestamp */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0A2540] text-white flex items-center justify-center font-black text-xs shrink-0 border border-[#0A2540]">
                          {post.authorName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-[#0A2540] dark:text-white">
                              {post.authorName}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#FAF9F5] dark:bg-[#071324] border border-[#E5E5DE] dark:border-[#1E3A5F] text-[#0A2540]/70 dark:text-slate-300">
                              {post.authorRole}
                            </span>
                          </div>
                          <div className="text-[11px] font-semibold text-[#0A2540]/50 dark:text-slate-400">
                            {new Date(post.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Post Type Pill */}
                      <div>
                        {post.postType === "expense" ? (
                          <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                            💰 Spent: {formatCurrency(post.amountSpent, currency)}
                          </span>
                        ) : post.postType === "issue" ? (
                          <span className="px-3 py-1 rounded-xl text-xs font-black bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1">
                            ⚠️ Site Alert
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-xl text-xs font-black bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-800 flex items-center gap-1">
                            🏗️ Progress Log
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Worksite quick telemetry */}
                    {(post.metadata.weather || post.metadata.headcount) && (
                      <div className="flex items-center gap-3 text-[11px] font-bold text-[#0A2540]/70 dark:text-slate-400">
                        {post.metadata.weather && (
                          <span className="flex items-center gap-1">
                            ☀️ {post.metadata.weather}
                          </span>
                        )}
                        {post.metadata.headcount && post.metadata.headcount > 0 && (
                          <span className="flex items-center gap-1">
                            👷 {post.metadata.headcount} Workers On Site
                          </span>
                        )}
                      </div>
                    )}

                    {/* Tagged colleagues highlight */}
                    {post.taggedUsers && post.taggedUsers.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-[#0A2540]/80 dark:text-slate-300">
                        <span className="text-[11px] text-[#0A2540]/50 dark:text-slate-500">Mentioned:</span>
                        {post.taggedUsers.map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[11px] font-black"
                          >
                            @{tag.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Main Post Content */}
                    <div className="text-base text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                      {post.content}
                    </div>

                    {/* Expense Callout Box if spent */}
                    {post.postType === "expense" && post.amountSpent > 0 && (
                      <div className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-[#071324] border-2 border-[#E5E5DE] dark:border-[#1E3A5F] flex items-center justify-between">
                        <div>
                          <div className="text-xs font-black uppercase tracking-wider text-[#0A2540]/70 dark:text-slate-300">
                            Disbursement / Cost Outflow
                          </div>
                          <div className="text-xl font-black font-mono text-[#0A2540] dark:text-white mt-0.5">
                            {formatCurrency(post.amountSpent, currency)}
                          </div>
                        </div>
                        {post.expenseCategory && (
                          <span className="px-3.5 py-1.5 rounded-lg text-sm font-bold bg-white dark:bg-[#0A1931] border border-[#E5E5DE] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white">
                            Category: {post.expenseCategory}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Photos in post */}
                    {post.mediaUrls && post.mediaUrls.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {post.mediaUrls.map((url, i) => (
                          <div
                            key={i}
                            className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-[#E5E5DE] relative"
                          >
                            <img
                              src={url}
                              alt="Site progress proof"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as any).src = "https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?w=500&auto=format&fit=crop";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Social Interactions: Likes & Comments */}
                    <div className="pt-2 border-t border-[#E5E5DE] dark:border-[#1E3A5F] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            post.userLiked
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "hover:bg-slate-100 dark:hover:bg-[#071324] text-[#0A2540]/70 dark:text-slate-300"
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${post.userLiked ? "fill-emerald-600" : ""}`} />
                          <span>{post.likesCount > 0 ? post.likesCount : "Acknowledge"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-[#0A2540]/70 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#071324] transition-all cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>
                            {post.comments.length > 0 ? `${post.comments.length} Comments` : "Reply"}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Expandable Comment Thread */}
                    {activeCommentPostId === post.id && (
                      <div className="pt-3 space-y-3 bg-[#FAF9F5] dark:bg-[#071324] p-3.5 rounded-xl border border-[#E5E5DE] dark:border-[#1E3A5F]">
                        {/* Existing comments */}
                        {post.comments.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {post.comments.map((comm) => (
                              <div
                                key={comm.id}
                                className="bg-white dark:bg-[#0A1931] p-2.5 rounded-lg border border-[#E5E5DE] dark:border-[#1E3A5F] text-xs space-y-1"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-black text-[#0A2540] dark:text-white">
                                    {comm.authorName} ({comm.authorRole})
                                  </span>
                                  <span className="text-[10px] text-[#0A2540]/50 dark:text-slate-400">
                                    {new Date(comm.createdAt).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <p className="text-slate-800 dark:text-slate-200">{comm.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add reply input */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Write a reply or sign-off comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddComment(post.id);
                              }
                            }}
                            className="flex-1 px-3 py-2 bg-white dark:bg-[#0A1931] border border-[#E5E5DE] dark:border-[#1E3A5F] rounded-lg text-xs font-semibold text-[#0A2540] dark:text-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddComment(post.id)}
                            className="px-3.5 py-2 bg-[#0A2540] hover:bg-[#003366] text-white rounded-lg text-xs font-black uppercase cursor-pointer"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
  );
}
