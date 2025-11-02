export type ApiErr = {
  message: string,
  status: number,
  response: {
    data: {
      message: string
    }
  }
}

export type PostsTypes = {
  title: string,
  content: string,
  id: string,
  userId: string,
  createdAt: string,
  user: {
    name: string
  },
  tags: string[],
  reactions: {
    type: string,
    id: string
  }[],
  likedPost: {
    userId: string
  }[],
  comment: {
    id: string,
    comment: string,
    createdAt: string,
    userId: string,
    user: {
      name: string
    }
    childComment: {
      id: string,
      comment: string,
      createdAt: string,
      userId: string,
      parentCommentId: string
      user: {
        name: string
      }
    }[]
  }[]
}

export type PostsPropsTypes = {
  posts: PostsTypes[] | undefined,
  searchPost: string[],
  isLoading: boolean,
  isError: boolean,
  errorMessage: string | null | undefined,
}

export type CommentPropsType = {
  post?: PostsTypes,
  setIsCommentAdded: (value: boolean) => void
}

export type ChildCommentPropsType = {
  commentId: string,
  commentAuthor: string,
  postId: string,
  setIsReplyBtn: (value: string | undefined) => void
}

export type UserPostDetailsType = {
  title: string,
  content: string,
  id: string,
  userId: string,
  createdAt: string,
  tags: string[],
  reactions: {
    type: string,
    id: string
  }[],
}

export type SavedPostType = {
  id: string,
  likedAt: string,
  post: {
    title: string,
    content: string,
    id: string,
    userId: string,
    createdAt: string,
    user: {
      name: string
    },
    tags: string[],
  }
}
