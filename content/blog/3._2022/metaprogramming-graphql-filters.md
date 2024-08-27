---
title: Metaprograming Filters with Rails GraphQL
description: How Ruby’s ClassMethods helped to create some solid GraphQL helpers for filtering data.
og:
  title: "Metaprogramming Filters with Rails GraphQL"
  description: How Ruby’s ClassMethods helped to create some solid GraphQL helpers for filtering data.
path: '/blog/ruby-on-rails/metaprogramming-graphql-filters'
image:
  src: "https://ik.imagekit.io/mthomps4/site/posts/metaprogramming-graphql-filters/featured.png"
  alt: Fox with goggles
publishedOn: "2022-12-08"
tags: ["Metaprogramming", "Rails", "GraphQL"]
---

<img src="https://ik.imagekit.io/mthomps4/site/posts/metaprogramming-graphql-filters/featured.png" alt="featured.png" class="featured-image">

First off if you have no idea what Metaprogramming is or how it could apply to GraphQL in Ruby, don’t worry. Most people hear the terms and view it as magic land that few have a reason to venture into… and for the most part, they may be right. Do you really need all that overloading and extra class utils? Of course not, there are *plenty* of giant Ruby files. However, it does feel good when you to able to those files clean and organized for your day-to-day work.

The only assumption I’ll be making here is that you have some basic understanding of Rails [`scopes`](https://guides.rubyonrails.org/active_record_querying.html#scopes) and GraphQL.

In fact, there’s a good article that addresses ruby metaprogramming here: [https://www.toptal.com/ruby/ruby-metaprogramming-cooler-than-it-sounds](https://www.toptal.com/ruby/ruby-metaprogramming-cooler-than-it-sounds)

Today, I wanted to address how the mystical unknown of Ruby’s ClassMethods helped to create some solid GraphQL helpers for filtering data.

## The Scenario

Let’s set up the scenario…

In GraphQL (or any API setup) you may wish to create filters for your queries. Shocker I know… but imagine ‘Jim’ needs to search through the company's past consultations by the sales rep's name or the customer's name.

“No problem, Jim!”

![Jim from the Office](https://ik.imagekit.io/mthomps4/site/posts/metaprogramming-graphql-filters/jim.png)

## The Code

Let's take a look at the schema we have to work with. In this example, we have a `consult` that is assigned to both a `user` and a `sales_rep`. So to recap in our example Jim the sales rep needs to query Consults based on the folks’ names.

```ruby
create_table "users", force: :cascade do |t|
    t.text "email", null: false
    t.text "first_name", null: false
    t.text "last_name", null: false
  t.text "full_name", null: false // before save join
  // other values...
end

create_table "sales_reps", force: :cascade do |t|
    t.text "email", null: false
    t.text "first_name", null: false
    t.text "last_name", null: false
  t.text "full_name", null: false // before save join
  // other values...
end

create_table "consults", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "sales_rep_id", null: false
    t.string "consult_type"
    t.text "notes"
  t.date "created_on", default: -> { "CURRENT_TIMESTAMP" }

  // other values...
    t.index ["sales_rep_id"], name: "index_consults_on_rep_id"
    t.index ["user_id"], name: "index_consults_on_user_id"
  end
```

Sweet, not too bad of a request — let's take a look at what this should look like w/ GraphQL and work backward a bit.

```graphql
query($userFullName: StringFilters, $salesRepFullName: StringFilters){
      consults(userFullName: $userFullName, salesRepFullName: $salesRepFullName) {
          id
     notes
     user {
      id
      firstName
      lastName
     }
     salesRep {
      id
      firstName
      lastName
     }
    }
 }

```

Wait! what are `StringFilters` ?!

Does the end user want an exact match or a fuzzy match? include a set of values? exclude? do they need a range of values? Who knows…

When building out an API I never want to assume how folks want to interact with the endpoints I’m building. They should be dynamic and flexible. Today it's Jim, tomorrow it's Pam, then the whole accounting firm drops a bomb of chili on our app.

Let’s simply protect ourselves and build out a Filter class that can be flexible enough to support folks as we continue to grow up front.

```ruby
module Types
  module Filters
    class StringFilters < Types::Base::BaseInputObject
      description 'A way to filter string fields.'

      argument 'contains', String, required: false
      argument 'startsWith', String, required: false
      argument 'endsWith', String, required: false
      argument 'equals', String, required: false
      argument 'gt', String, required: false
      argument 'gte', String, required: false
      argument 'lt', String, required: false
      argument 'lte', String, required: false
      argument 'notIn', [String], required: false, description: "['value1', 'value2']"
      argument 'in', [String], required: false, description: "['value1', 'value2']"
    end
  end
end
```

## The ‘issue’

Here is where we start to get into our issue, at some point, we need to resolve these filters and get said data… the issue we have no clue what filters the end consumer may use. That’s kinda the point. While we could litter our GQL resolver with a ton of logic we really want to let our Models and Active Record handle this kind of thing. So far nothing has been truly GraphQL-specific. Rather we simply have a consumer asking for some filtered data.

With that in mind, lets aim to keep that logic out of GQL and in a place where we can leverage it throughout the app.

Well in rails land, that generally means adding some `scope`(s) to our models — let's build some scopes in our `Consult` model that can handle this.

```ruby
scope :user_name_contains, lambda { |query|
  joins(:user).where("users.full_name" ILIKE ?", '%' + sanitize_sql_like(query) + '%')
}

scope :user_name_equals, lambda { |query|
  joins(:user).where("users.full_name": query)
}
```

**Wait a second?!… hold up! Hit the brakes!**

![hitting the breaks](https://ik.imagekit.io/mthomps4/site/posts/metaprogramming-graphql-filters/brakes.png)

Let's think about this at scale for a second.
We now have:

- A list of String Filters that could be scoped to MULTIPLE fields on my Model
- Some of those fields are tied to a relation
- What happens when Pam and Accounting actually do ask for more…

Holy cow Batman, that’s a lot of scopes to add to our models… GROSS!!

There has to be a way to keep this clean and DRY…

## Solution Time

Insert some fun metaprogramming and new class utils. To be frank this stuff is always confusing to me at first so let's take a look at the end result first and we’ll chat about what’s going on.

**consult.rb (Model)**

```ruby
class Consult < ApplicationRecord
  include GqlScopeHelpers
  @filterable_args = %i[sales_rep_full_name user_full_name user_id sales_rep_id created_on]
  include_relational_string_filters_for(SalesRep, 'full_name')
  include_relational_string_filters_for(SalesRep, 'id')
  include_relational_string_filters_for(User, 'full_name')
  include_relational_string_filters_for(User, 'id')
  include_date_filters_for('created_on')

class User < ApplicationRecord
  include GqlScopeHelpers
  include_string_filters_for('full_name')

class SalesRep < ApplicationRecord
  include GqlScopeHelpers
  include_string_filters_for('full_name')
```

**list_consults.rb (GQL Resolver)**

```ruby
module Queries
    module Consults
      class ListConsults < BaseQuery
        type Types::ConsultType.connection_type, null: false
        description 'Filter/View All Consults'

        argument :sales_rep_full_name, Types::Filters::StringFilters, required: false
        argument :user_full_name, Types::Filters::StringFilters, required: false
        argument :user_id, Types::Filters::StringFilters, required: false
        argument :sales_rep_id, Types::Filters::StringFilters, required: false
        argument :created_on, Types::Filters::DateFilters, required: false

        def authorized?(_query = nil)
          is_sales_rep? || is_user? # helper utils from BaseQuery
        end

        def resolve(args = {})
          # scope consults to the current user
          query = ::Consult.context_user(context[:current_user])

          # build up the query and apply all filters
          ::Consult.apply_scope_filters(query, args)

    rescue StandardError => e
          Sentry.capture_message("GQL: List Consults: #{e}")
          raise GraphQL::ExecutionError, "Unknown Error #{e}"
        end
      end
    end
  end
end
```

**gql_scope_helpers.rb**

```ruby
module GqlScopeHelpers
  extend ActiveSupport::Concern

  module ClassMethods
    # Should match app/graphql/types/filters/string_filters.rb
    def include_string_filters_for(key)
      scope :"#{key}_contains", ->(query) { where("#{key} ILIKE ?", '%' + sanitize_sql_like(query) + '%') }
      scope :"#{key}_starts_with", ->(query) { where("#{key} ILIKE ?", sanitize_sql_like(query) + '%') }
      scope :"#{key}_ends_with", ->(query) { where("#{key} ILIKE ?", '%' + sanitize_sql_like(query)) }
      scope :"#{key}_equals", ->(query) { where("#{key}": query) }
      scope :"#{key}_gt", ->(query) { where("LENGTH(#{key}) > ?", query) }
      scope :"#{key}_gte", ->(query) { where("LENGTH(#{key}) >= ?", query) }
      scope :"#{key}_lt", ->(query) { where("LENGTH(#{key}) < ?", query) }
      scope :"#{key}_lte", ->(query) { where("LENGTH(#{key}) <= ?", query) }
      scope :"#{key}_not_in", ->(query) { where.not("#{key}": query) }
      scope :"#{key}_in", ->(query) { where("#{key}": query) }
    end

    def include_relational_string_filters_for(klass, relational_field)
      key = "#{klass.to_s.underscore}_#{relational_field}"
      join_name = klass.name.underscore.to_sym
      pluralized = join_name.to_s.pluralize

      # Previously had these as .merge klass.send -- some keys collide and conflict with `merge` once compiled to SQL e.g. "full_name"
      scope :"#{key}_contains", lambda { |query|
                                  joins(join_name).where("#{pluralized}.#{relational_field} ILIKE ?", '%' + sanitize_sql_like(query) + '%')
                                }

      scope :"#{key}_starts_with", lambda { |query|
                                     joins(join_name).where("#{pluralized}.#{relational_field} ILIKE ?", sanitize_sql_like(query) + '%')
                                   }
      scope :"#{key}_ends_with", lambda { |query|
                                   joins(join_name).where("#{pluralized}.#{relational_field} ILIKE ?", sanitize_sql_like(query))
                                 }

      scope :"#{key}_equals", lambda { |query|
                                joins(join_name).where("#{pluralized}.#{relational_field}": query)
                              }

      scope :"#{key}_not_in", ->(query) { joins(join_name).where.not("#{pluralized}.#{relational_field}": query) }
      scope :"#{key}_in", ->(query) { joins(join_name).where("#{pluralized}.#{relational_field}": query) }
    end

    def include_date_filters_for(key)
      scope :"#{key}_equals", ->(query) { where("#{key}": query) }
      scope :"#{key}_gt", ->(query) { where("#{key} > ?", query) }
      scope :"#{key}_gte", ->(query) { where("#{key} >= ?", query) }
      scope :"#{key}_lt", ->(query) { where("#{key} < ?", query) }
      scope :"#{key}_lte", ->(query) { where("#{key} <= ?", query) }
      scope :"#{key}_not_in", ->(query) { where.not("#{key}": query) }
      scope :"#{key}_in", ->(query) { where("#{key}": query) }
    en

    # args: [{:name => {:contains => "asdf"}}, {:created_on => {:lt => "2022-09-09"} }]
    def apply_scope_filters(composed_query = self, args)
      args.keys.each do |arg|
        next unless @filterable_args.include?(arg)

        # {:contains => "asdf"}
        hash = args[arg]

        # .send(:name_contains, "asdf")
        hash.keys.each do |key|
          composed_query = composed_query.send(:"#{arg}_#{key}", hash[key])
        end
      end

      # return compiled results
      composed_query
    end
  end
end

```

Alright, I know that’s a lot but let's step through this.

The first thing you’ll notice is our GraphQL Resolver is SUPER clean with a single helper method.

`::Consult.apply_scope_filters(query, args)`

Our consult model is fairly clean as well considering. With seven lines of code we’ve supported:

- All the filter support for Sales Rep Names
- All the filter support for User Names
- All the support to filter through Rep Ids and User Ids
- All the support to match created dates and filter by date ranges

But how —

The magic lies in our new GQL Scope Helpers file.

Taking a look back at our original scopes, if you notice, the SQL here doesn’t really change. What does change is the Model name, Field, and Query data the end consumer will pass in. Smells like a function to me… and why stop at one filter, lets support them all!

The cool thing about using ClassMethods here is that by requiring our new helper the Model is able to run these functions when we go to build and compile. Let’s take another look at the Concern Model.

```ruby
class Consult < ApplicationRecord
  include GqlScopeHelpers
 ...
  include_relational_string_filters_for(User, 'full_name')
  include_relational_string_filters_for(User, 'id')
```

When we go to build and run our app with `rails c` you can actually see ALL of the scopes got applied to the model.

Neat!

![scopes](https://ik.imagekit.io/mthomps4/site/posts/metaprogramming-graphql-filters/irb.png)

## So how does this work?

The last magical helper is our `apply_scope_filters` method and `@filterable_args`. Because these methods are all going to be run and compiled with the models, @filterable_args can be defined per Model. Apply Scope Filters is going to take ALL the args passed from our GraphQL endpoint (again… or other). @filterable_args is simply a guard when mapping over the args, if the key does not match one of our scope filters — we continue on. If it does… we are able to do some more magic with `{model}.send` This allows us to call a method, in our case a `scope` on the model, and continue to build our Query until we're finally ready for Active Record to do its thing.

```ruby
# args: [{:name => {:contains => "asdf"}}, {:created_on => {:lt => "2022-09-09"} }]
    def apply_scope_filters(composed_query = self, args)
      args.keys.each do |arg|
        next unless @filterable_args.include?(arg)

        # {:contains => "asdf"}
        hash = args[arg]

        # .send(:name_contains, "asdf")
        hash.keys.each do |key|
          composed_query = composed_query.send(:"#{arg}_#{key}", hash[key])
        end
      end

      # return compiled results
      composed_query
    end

```

In the end, what we are left with is a composed_query that includes ALL the allowed filters defined. Let's take that for a spin in `rails c` as well.

![rails c query](https://ik.imagekit.io/mthomps4/site/posts/metaprogramming-graphql-filters/query.png)

Using this in our GQL Resolver we now know that ANY combination of filters the consumer sends *should pass right through and build up to an efficient Active Record Query. Even better, with tools like `Dataloader` out of the box with `rails-graphql` — we are ensured to not loop and slam our DB for the world by accident.

## Conclusion

```ruby
# user.rb
class User < ApplicationRecord
  include GqlScopeHelpers
  include_string_filters_for('full_name')
  # ...
end

# list_consults.rb
module Queries
    module Consults
      class ListConsults < BaseQuery
        type Types::ConsultType.connection_type, null: false

        argument :user_full_name, Types::Filters::StringFilters, required: false
    # other args...

        def resolve(args = {})
          # build up the query and apply all filters
          ::Consult.apply_scope_filters(::Consult, args)

    rescue StandardError => e
          Sentry.capture_message("GQL: List Consults: #{e}")
          raise GraphQL::ExecutionError, "Unknown Error #{e}"
        end
      end
    end
  end
end
```

So was all the setup worth it?!

Time will tell, but for this scale project, I believe so. This setup was actually simple to test e2e by ensuring that GQL filters were working as expected and giving us even more confidence in our ClassMethods helper file.

For now, all I can say is that my dev brain is a lot happier reading a slim model and resolver in comparison to the nested scope chaos it could have been. While building these methods may be overkill for some, I do enjoy the ability to quickly support the requests continuing to come in. The API is still flexible, open, and so far maintainable. That’s all we can ask for.
