const connection = require('../config/mysql')

module.exports = {
  getPic: () => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM pic", (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  totalUser: () => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT COUNT(*) as total FROM users", (error, result) => {
        !error ? resolve(result[0].total) : reject(new Error(error))
      })
    })
  },
  getById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM users WHERE id = ?", id, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  get: (limit, offset) => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT users.id, users.name, users.phone, users.email, users.address, users.img_ktp, GROUP_CONCAT(' ', pic.name) as pic_name, GROUP_CONCAT(' ', pic.id) as pic_id FROM users LEFT JOIN users_pic ON users_pic.id_user = users.id LEFT JOIN pic ON pic.id = users_pic.id_pic GROUP BY users.id LIMIT ? OFFSET ?", [limit, offset], (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  checkPhone: (phone) => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT phone FROM users WHERE phone = ?", phone, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  post: (data) => {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO users SET ?", data, (error, result) => {
        if (!error) {
          resolve(result)
        } else {
          reject(new Error(error))
        }
      })
    })
  }, check_user: (email) => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM users WHERE email = ?", email, (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
      })
    })
  }, postPic: (data) => {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO users_pic SET ?", data, (error, result) => {
        if (!error) {
          resolve(result)
        } else {
          reject(new Error(error))
        }
      })
    })
  }, patchUser: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query("UPDATE users SET ? WHERE id = ?", [setData, id], (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error));
        }
      })
    })
  }, deleteUser: (id) => {
    return new Promise((resolve, reject) => {
      connection.query("DELETE FROM users WHERE id = ?", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error));
        }
      })
    })
  }, deletePic: (id) => {
    return new Promise((resolve, reject) => {
      connection.query("DELETE FROM users_pic WHERE id_user = ?", id, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error));
        }
      })
    })
  }

}