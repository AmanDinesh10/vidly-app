const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/mongo-exercises")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: Date,
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    tags: ["angular", "frontend"],
    date: "2018-01-24T21:42:27.388Z",
    name: "Angular Course",
    author: "Mosh",
    isPublished: true,
    price: 15,
  });

  const result = await course.save();
  console.log(result);
}

// createCourse();

// async function getCourses() {
//     const courses = await Course
//         .find({tags: "backend", isPublished: true})
//         .sort({name: 1})
//         .select({name: 1, author: 1})

//     console.log(courses)
// }

// // getCourses();

async function getCourses() {
  // Solution 1
  // return await Course
  //     .find({isPublished: true, tags: 'backend' })
  //     .sort({name: 1}) // .sort('name')
  //     .select({name: 1, author: 1}) // .select('name author')

  // Solution 2
  // return await Course
  //     .find({isPublished: true, tags: { $in : ['frontend', 'backend']}})
  //     .sort('-price')
  //     .select('name author price')

  // return await Course
  //   .find({isPublished: true})
  //   .or([ {tags: 'frontend'}, {tags: 'backend'} ])
  //   .sort("-price")
  //   .select("name author price");

  // Solution 3
  return await Course.find({ isPublished: true })
    .or([{ price: { $gte: 15 } }, { name: /.*by.*/i }])
    .sort("-price")
    .select("name author price");
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}

// run();

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

updateCourse("625e48b077fa502c48c9098a");
