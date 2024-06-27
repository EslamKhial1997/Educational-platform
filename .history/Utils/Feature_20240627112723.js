class FeatureApi {
  constructor(MongooseQueryApi, QueryStringApi) {

    this.MongooseQueryApi = MongooseQueryApi;
    this.QueryStringApi = QueryStringApi;
  } 

  Fillter() {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const QueryStringObj = { ...this.QueryStringApi };
    const excludes = ["page", "limit", "skip", "sort", "fields"];
    excludes.forEach((failds) => delete QueryStringObj[failds]);
    let QueryString = JSON.stringify(QueryStringObj);
    QueryString = QueryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.MongooseQueryApi = this.MongooseQueryApi.find(JSON.parse(QueryString));
    return this;
  }

  Sort() {
    if (this.QueryStringApi.sort) {
      const sortby = this.QueryStringApi.sort.split(",").join(" ");
      this.MongooseQueryApi = this.MongooseQueryApi.sort(sortby);
    } else {
      this.MongooseQueryApi = this.MongooseQueryApi.sort("createdAt");
    }
    return this;
  }

  Fields() {
    if (this.QueryStringApi.fields) {
      const fileds = this.QueryStringApi.fields.split(",").join(" ");
      this.MongooseQueryApi = this.MongooseQueryApi.select(fileds);
    } else {
      this.MongooseQueryApi = this.MongooseQueryApi.select("-__v");
    }
    return this;
  } 

  Search(modelName) {
    console.log(modelName);
    let QuerySearch = {};

    // تحقق من وجود الكلمة المفتاحية keyword في QueryStringApi
    if (this.QueryStringApi.keyword) {
        const keywordRegex = new RegExp(this.QueryStringApi.keyword, "i");

        // بناء QuerySearch بناءً على modelName أو عدم وجوده
        if (modelName === undefined) {
            QuerySearch.$or = [
                { "coupon.number": { $regex: keywordRegex } }
                // يمكن إضافة حقول أخرى للبحث إذا لزم الأمر
            ];
        } else {
            QuerySearch = {
                "coupon.number": { $regex: keywordRegex }
            };
        }

        // يمكن إضافة فلاتر إضافية إذا كانت موجودة
        if (this.QueryStringApi.someValue) {
            QuerySearch.someField = this.QueryStringApi.someValue;
        }
    }

    console.log(QuerySearch);
    this.MongooseQueryApi = this.MongooseQueryApi.find(QuerySearch);
    log
    return this;
}

  
  Paginate(countDoc) {
    const page = this.QueryStringApi.page * 1 || 1;
    const limit = this.QueryStringApi.limit * 1 || 100;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const Pagination = {};
    Pagination.CurrentPage = page;
    Pagination.limit = limit;
    Pagination.numberOfPage = Math.ceil(countDoc / limit);
    if (endIndex < countDoc) {
      Pagination.next = page + 1;
    }
    if (skip > 0) {
      Pagination.preve = page - 1;
    }
    this.MongooseQueryApi = this.MongooseQueryApi.skip(skip).limit(limit);
    this.PaginateResult = Pagination;
    return this;
  }
}
module.exports = FeatureApi;
