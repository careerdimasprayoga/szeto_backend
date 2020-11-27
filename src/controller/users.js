const { get, totalUser, post, checkPhone, postPic, deleteUser, getPic, getById, patchUser, deletePic } = require("../model/users")
const qs = require("querystring");
const helper = require("../helper/index.js");

const prevPage = (page, currentQuery) => {
  if (page > 1) {
    const generatedPage = { page: page - 1 }
    const resultPrevLink = { ...currentQuery, ...generatedPage };
    return qs.stringify(resultPrevLink);
  } else {
    return null
  }
} 
const nextPage = (page, totalPage, currentQuery) => {
  if (page < totalPage) {
    const generatedPage = { page: page + 1 }
    const resultNextLink = { ...currentQuery, ...generatedPage };
    return qs.stringify(resultNextLink);
  } else {
    return null
  }
}

module.exports = {

  getPic: async (request, response) => {
    try {
      let data = await getPic()
      return helper.response(response, 200, "Load PIC success", data);
    } catch (error) {
      return helper.response(response, 400, "Load PIC error", error);
    }
  },
  getTotalUsers: async (request, response) => {
    try {
      let data = await totalUser()
      return helper.response(response, 200, "Load Total Users success", data);
    } catch (error) {
      return helper.response(response, 400, "Load Total Users error", error);
    }
  },
  get: async (request, response) => {
    try {
      let { page, limit } = request.query
      page = parseInt(page)
      limit = parseInt(limit)
      let totalUsers = await totalUser()
      let totalPage = Math.ceil(totalUsers / limit)
      let offset = page * limit - limit
      let prevLink = prevPage(page, request.query)
      let nextLink = nextPage(page, totalPage, request.query)
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalUsers,
        prevLink: prevLink && `http://${process.env.IP}:${process.env.PORT}/users?${prevLink}`,
        nextLink: nextLink && `http://${process.env.IP}:${process.env.PORT}/users?${nextLink}`
      }
      const result = await get(limit, offset);
      return helper.response(response, 200, "Load Users success", result, pageInfo);
    } catch (error) {
      return helper.response(response, 400, "Load Users error", error);
    }
  },
  post: async (request, response) => {
    try {
      const { name, phone, email, address } = request.body
      const data = {
        name: name,
        phone: phone,
        email: email,
        address: address,
        img_ktp: !request.file ? 'no image' : request.file.filename
      }
      const check = await checkPhone(phone)
      if(check.length >= 1) {
        return helper.response(response, 400, "Phone number already registered");  
      } else if(name === "") {
        return helper.response(response, 400, "Name cannot be null");  
      } else if(phone === "") {
        return helper.response(response, 400, "Phone number cannot be null");  
      } else if(email === "") {
         return helper.response(response, 400, "Email number cannot be null");  
      } else if(address === "") {
        return helper.response(response, 400, "Address cannot be null");  
      } else {
        const result = await post(data);
        let arr = request.body.pic_id.split(',')
        for (let i = 0; i < arr.length; i++) {
          let data2 = {
            id_user: result.insertId,
            id_pic: arr[i]
          }
          const result2 = await postPic(data2);
        }
        return helper.response(response, 200, "Add Users success");
      }
    } catch (error) {
      console.log(error)
      return helper.response(response, 400, "Add Users error", error);
    }
  },

  deleteUser: async (request, response) => {
    try {
      console.log(request.params)
      const { id } = request.params
      const result = await deleteUser(id)
      return helper.response(response, 201, "Delete user success", result)
    } catch (error) {
      console.log(error)
      return helper.response(response, 400, "Delete user error", error)
    }
  },
  patchUser: async (request, response) => {
    try {
      const { id } = request.params;
      const { name, phone, email, address, pic_id } = request.body;
      const id_user = await getById(id);
      const setData = {
        name: name,
        img_ktp: !request.file ? id_user[0].img_ktp : request.file.filename,
        phone: phone,
        email: email,
        address: address
      }
      await deletePic(id)
      let arrPic = request.body.pic_id.split(',').map(Number)
      for (let i = 0; i < arrPic.length; i++) {
        let dataPic = {
          id_user: id,
          id_pic: arrPic[i]
        }
        await postPic(dataPic)
      }
      const check = await checkPhone(phone)
      if(name === "") {
        return helper.response(response, 400, "Name cannot be null");  
      } else if(phone === "") {
        return helper.response(response, 400, "Phone number cannot be null");  
      } else if(email === "") {
         return helper.response(response, 400, "Email number cannot be null");  
      } else if(address === "") {
        return helper.response(response, 400, "Address cannot be null");  
      } else {
        if (id_user.length > 0) {
          const result = await patchUser(setData, id);
          return helper.response(response, 200, "Edit user success", result);
        } else {
          return helper.response(response, 404, "User not found");
        }
      }
    } catch (error) {
      console.log(error)
      return helper.response(response, 400, "Bad Request", error);
    }
  }

}
