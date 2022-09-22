class ClanMember {

    constructor(MemberID, MemberName, ClanRole, DateJoined) {
        this.MemberID = MemberID;
        this.MemberName = MemberName;
        this.ClanRole = ClanRole;
        this.DateJoined = DateJoined;
    }
}

module.exports.ClanMember = ClanMember