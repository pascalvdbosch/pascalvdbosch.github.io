using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

// Microsoft.EntityFrameworkCore.Sqlite
// Microsoft.EntityFrameworkCore.Tools

namespace Transactions
{
    public class MyContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder b)
        {
            b.UseSqlite(@"Data Source=data.db");
        }
        public DbSet<Student> Students { get; set; }
    }
    public class Student
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class Program
    {
        static void Main(string[] args)
        {
            using (var c = new MyContext())
            {

                Console.WriteLine("Wat wil je doen?");
                Console.WriteLine("1 = bob aanmaken");
                Console.WriteLine("2 = bob verwijderen");
                Console.WriteLine("3 = bob hernoemen naar john");
                switch (Console.ReadKey().KeyChar)
                {
                    case '1':
                        c.Add(new Student() { Name = "Bob" });
                        c.SaveChanges();
                        return;
                    case '2':
                        Console.WriteLine("Removing Bob...");
                        var s = c.Students.Remove(c.Students.First());
                        c.SaveChanges();
                        Console.WriteLine("Done!");
                        Console.ReadLine();
                        return;
                    case '3':
                        try
                        {
                            Console.WriteLine("Changing Bob into John...");
                            Console.WriteLine("1) Retrieve Bob from database");
                            Console.ReadLine();
                            var bob = c.Students.First();
                            Console.WriteLine("1) Done!");
                            Console.WriteLine("2) Change name to John");
                            Console.ReadLine();
                            bob.Name = "John";
                            Console.WriteLine("2) Done!");
                            Console.WriteLine("3) SaveChanges");
                            Console.ReadLine();
                            c.SaveChanges();
                            Console.WriteLine("Done!");
                            Console.ReadLine();
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine(ex.ToString());
                            Console.ReadLine();
                        }
                        return;
                }
            }
        }
    }
}
