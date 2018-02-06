export function getRoomFromUrl() {
    let room = window.location.pathname.slice(6);   
    let pos = room.indexOf('/');
    if (pos !== -1) {
        room = room.slice(0, pos);
    }

    return room;
}