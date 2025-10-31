import { query, mutation } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import { v } from 'convex/values'
// WICHTIG: Importiere das gesamte DataModel statt nur Doc
import type { DataModel } from "./_generated/dataModel";

// Typ des 'projects'-Dokuments direkt vom DataModel ableiten.
// Das ist der empfohlene, stabile Ansatz.
type ProjectDoc = DataModel["projects"]["document"];

// Typ eines einzelnen Subtask-Objekts ableiten (funktioniert weiterhin perfekt)
type Subtask = ProjectDoc['subtasks'][number];


export const getProjects = query({
    args: {},
    handler: async (ctx : QueryCtx) => {
        const projects = await ctx.db.query("projects").collect();
        return projects;
    }
})

export const setSubtaskChecked = mutation({
    args: {
        taskId : v.id("projects"),
        subTaskName : v.string()
    },
    handler: async (ctx : MutationCtx, args ) => {
        const task = await ctx.db.get(args.taskId)
        if (!task){
            throw new Error("Task Not Found!")
        }

        const updatedSubtaskState = task.subtasks.map((subtask : Subtask) => {
            if(subtask.title === args.subTaskName){
                return {
                    ...subtask,
                    isDone : !subtask.isDone
                }
            }
            return subtask
        })

        await ctx.db.patch(args.taskId, {
            subtasks : updatedSubtaskState
        })

        return true
    }
})