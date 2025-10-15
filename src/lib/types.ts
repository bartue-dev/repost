export type ApiErr = {
  message: string,
  status: number,
  response: {
    data: {
      message: string
    }
  }
}