export function getRoomId (userId1:string|string[], userId2:string|string[]) {
  const sortedIds = [userId1, userId2].sort()
  const roomId = sortedIds.join('-');
  return roomId;
}