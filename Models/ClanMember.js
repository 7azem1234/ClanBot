class ClanMember {

    constructor(MemberID, MemberName, ClanRole, MessagesCounter, DateJoined) {
        this.MemberID = MemberID;
        this.MemberName = MemberName;
        this.ClanRole = ClanRole;
        this.MessagesCounter = MessagesCounter;
        this.DateJoined = DateJoined;
    }
}

module.exports.ClanMember = ClanMember