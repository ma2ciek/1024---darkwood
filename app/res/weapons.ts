export interface IWeaponData {
    name: string;
    dmg: number;
    distanceDmg?: number;
}

export const weapons: IWeaponData[] = [{
    name: "flashLight",
    dmg: 10,
}, {
    name: "knife",
    dmg: 20
}, {
    name: "handgun",
    dmg: 8,
    distanceDmg: 15
}];

export default weapons;