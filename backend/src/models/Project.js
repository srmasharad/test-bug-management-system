const db = require("../config/database");

class Project {
  static async create(data) {
    const { name, description, start_date, end_date, status } = data;
    const result = await db.query(
      "INSERT INTO projects (name, description, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description, start_date, end_date, status || "Active"]
    );
    return result.rows[0];
  }

  static async findAll() {
    const result = await db.query(
      "SELECT * FROM projects ORDER BY created_at DESC"
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(
      "SELECT * FROM projects WHERE project_id = $1",
      [id]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await db.query(
      `UPDATE projects SET ${fields.join(
        ", "
      )} WHERE project_id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    await db.query("DELETE FROM projects WHERE project_id = $1", [id]);
    return true;
  }
}

module.exports = Project;
