module.exports = function(mongoose){
     // Defines the Course Schema (How the DB is structured)
    var CourseSchema = new mongoose.Schema({
        code: String,
        status: {type: Boolean, default: true },
        url: String,
        teacher: String,
        name: String,
        description: String,
        start: { type: Date, default: Date.now },
        end: { type: Date, default: Date.now },
        assignments: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Assignment'
        }],
        students: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        }],
        slack_channels: [{
            channelId: String
        }],
        resources: [{
          type: mongoose.Schema.Types.ObjectId, ref: 'Resource'
        }],
        messages: [{
            title: String,
            content: String,
            creator: String,
            date: { type: Date, default: Date.now }
        }],
        creator : { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    });

      // Return the model
      return mongoose.model("Course", CourseSchema);
};
