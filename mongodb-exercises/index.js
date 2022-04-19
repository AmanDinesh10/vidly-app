const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Angular Course",
    author: "Mosh",
    tags: ["angular", "frontend"],
    isPublished: true,
  });

  const result = await course.save();
  console.log(result);
}

async function getCourses() {
  // eq (equal)
  // ne (not equal)
  // gt (greater than)
  // gte (greater than or eqaul to)
  // lt (less than)
  // lte (less than or equal to)
  // in
  // nin (not in)

  const pageNumber = 2;
  const pageSize = 10;
  // /api/courses?pageNumber=2&pageSize=10

  const courses = await Course.find({ author: "Mosh", isPublished: true })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });
  // .count();
  console.log(courses);

  // const courses = await Course
  //     // .find({price: {$gt: 10, $lte: 20}})
  //     // .find({price: { $in: [10, 15, 20]} })

  // or
  // and
  // const courses = await Course
  //             .find()
  //             .or([ { author: 'Mosh' }, { isPublished: true } ])
  //             .and([ { price: { $gt: 10 } } ])

  //   const courses = await Course
  //                 // Starts With Mosh
  //                 // .find({ author: /^Mosh/ })

  //                 // Ends With Hamedani
  //                 .find({ author: /Hamedani$/i })

  //                 // Contains Mosh
  //                 .find({ author: /.*Mosh.*/i })
}

// getCourses();

// Approach 1
// async function updateCourse(id) {

//     const course = await Course.findById(id);
//     if (!course) return;

//     // Approach 1
//     course.isPublished = true;
//     course.author = 'Another author'

//     // Approach 2
//     // course.set({
//     //     isPublished: true,
//     //     author: 'Another Author'
//     // });

//     const result = await course.save();
//     console.log(result)
// }

// Approach 2
async function updateCourse(id) {
  const course = await Course.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        author: "Jason",
        isPublished: false,
      },
    },
    { new: true }
  );
  console.log(course);
}

// updateCourse("625e48b077fa502c48c9098a");

async function removeCourse(id) {
  // const result = await Course.deleteOne({ _id: id });
  // console.log(result);

  const course = await Course.findByIdAndRemove(id);
  console.log(course);
}

removeCourse("625e3f21a956db477829d083");
