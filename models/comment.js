import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Comment = sequelize.define("Comment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIP: true
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

export default Comment;
