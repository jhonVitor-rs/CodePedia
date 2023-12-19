
export const convertDate = (date: string) => {
  const [day, hour] = date.split('T')
  const [hour1] = hour.split('.')

  return `${day} ${hour1}`
}