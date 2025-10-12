export type ApiErr = {
  status: number,
  response: {
    data: {
      message: string
    }
  }
}