export class Profile {
  readonly id: string;
  readonly userId: string;
  readonly name?: string;
  readonly bio?: string;
  readonly phone?: string;
  readonly photo?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    createdAt: Date,
    updatedAt: Date,
    name?: string,
    bio?: string,
    phone?: string,
    photo?: string,
  ) {
    this.id = id;
    this.userId = userId;

    if (name) this.name = name;
    if (bio) this.bio = bio;
    if (phone) this.phone = phone;
    if (photo) this.photo = photo;

    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
